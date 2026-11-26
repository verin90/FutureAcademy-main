const express = require('express');
const bcrypt = require('bcryptjs');
const { createHash, randomBytes } = require('node:crypto');
const { existsSync } = require('node:fs');
const { join } = require('node:path');
const { openDatabase } = require('./database');

const app = express();
const api = express.Router();
const db = openDatabase();
const cookieName = 'future_academy_session';
const ttl = 7 * 24 * 60 * 60 * 1000;
const host = process.env.FUTURE_HOST || '127.0.0.1';
const port = Number(process.env.PORT ?? 3001);
const cookieOptions = { httpOnly: true, sameSite: 'lax', path: '/', secure: process.env.FUTURE_SECURE_COOKIE === '1' };
const text = (value) => typeof value === 'string' ? value.trim() : '';
const emailValid = (email) => email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const passwordValid = (value) => typeof value === 'string' && value.length >= 8 && Buffer.byteLength(value) <= 72;
const allowedApplications = ['consultation', 'course', 'event', 'career'];

app.disable('x-powered-by');
app.use('/api', express.json({ limit: '16kb' }), api);

function sessionDigest(req) {
    const token = req.get('cookie')?.match(/(?:^|;\s*)future_academy_session=([a-f0-9]{64})(?:;|$)/)?.[1];
    return token ? createHash('sha256').update(token).digest('hex') : '';
}

function accountFor(req) {
    return db.prepare(`
        SELECT accounts.id, accounts.name, accounts.email
        FROM sessions JOIN accounts ON accounts.id = sessions.account_id
        WHERE sessions.digest = ? AND sessions.expires > ?
    `).get(sessionDigest(req), Date.now());
}

function signIn(req, res, account, status = 200) {
    const token = randomBytes(32).toString('hex');
    const digest = createHash('sha256').update(token).digest('hex');
    const now = Date.now();
    db.prepare('DELETE FROM sessions WHERE expires <= ? OR digest = ?').run(now, sessionDigest(req));
    db.prepare('INSERT INTO sessions (digest, account_id, expires) VALUES (?, ?, ?)').run(digest, account.id, now + ttl);
    res.cookie(cookieName, token, { ...cookieOptions, maxAge: ttl }).status(status).json({
        user: { id: account.id, name: account.name, email: account.email },
    });
}

api.use((_req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });

api.post('/register', async (req, res) => {
    const name = text(req.body?.name);
    const email = text(req.body?.email).toLowerCase();
    const password = req.body?.password;
    if (name.length < 2 || name.length > 100 || !emailValid(email) || !passwordValid(password)) {
        return res.status(400).json({ error: 'Проверьте имя, email и пароль (от 8 символов, до 72 байт).' });
    }
    const hash = await bcrypt.hash(password, 10);
    const account = db.prepare(`
        INSERT INTO accounts (name, email, password_hash) VALUES (?, ?, ?)
        ON CONFLICT (email) DO NOTHING RETURNING id, name, email
    `).get(name, email, hash);
    if (!account) return res.status(409).json({ error: 'Аккаунт с таким email уже существует.' });
    signIn(req, res, account, 201);
});

api.post('/login', async (req, res) => {
    const email = text(req.body?.email).toLowerCase();
    const password = req.body?.password;
    const account = db.prepare('SELECT * FROM accounts WHERE email = ?').get(email);
    if (!account || !passwordValid(password) || !(await bcrypt.compare(password, account.password_hash))) {
        return res.status(401).json({ error: 'Неверный email или пароль.' });
    }
    signIn(req, res, account);
});

api.post('/logout', (req, res) => {
    db.prepare('DELETE FROM sessions WHERE digest = ?').run(sessionDigest(req));
    res.clearCookie(cookieName, cookieOptions).status(204).end();
});

api.get('/me', (req, res) => {
    res.json({ user: accountFor(req) ?? null });
});

api.get('/applications', (req, res) => {
    const account = accountFor(req);
    if (!account) return res.status(401).json({ error: 'Войдите, чтобы посмотреть заявки.' });
    res.json(db.prepare('SELECT id, kind, subject, created_at FROM applications WHERE account_id = ? ORDER BY id DESC').all(account.id));
});

api.post('/applications', (req, res) => {
    const account = accountFor(req);
    const kind = text(req.body?.kind);
    const subject = text(req.body?.subject);
    const name = text(req.body?.name);
    const email = text(req.body?.email).toLowerCase();
    const phone = text(req.body?.phone);
    const digits = phone.replace(/\D/g, '').length;
    if (!allowedApplications.includes(kind) || !subject || subject.length > 180 ||
        name.length < 2 || name.length > 100 || !emailValid(email) ||
        !/^[0-9+()\s-]{7,32}$/.test(phone) || digits < 7 || digits > 15) {
        return res.status(400).json({ error: 'Проверьте имя, телефон и email.' });
    }
    const result = db.prepare(`
        INSERT INTO applications (account_id, kind, subject, name, email, phone) VALUES (?, ?, ?, ?, ?, ?)
    `).run(account?.id ?? null, kind, subject, name, email, phone);
    res.status(201).json({ id: result.lastInsertRowid });
});

api.use((_req, res) => res.status(404).json({ error: 'Маршрут API не найден.' }));

const dist = join(__dirname, '..', 'frontend', 'vite-project', 'dist');
if (existsSync(join(dist, 'index.html'))) {
    app.use(express.static(dist));
    app.get('/{*path}', (req, res, next) => {
        if (req.path.startsWith('/assets/') || /\.\w+$/.test(req.path)) return next();
        res.sendFile(join(dist, 'index.html'));
    });
}

app.use((error, _req, res, _next) => {
    if (error.status === 413) return res.status(413).json({ error: 'Запрос слишком большой.' });
    if (error.status === 400) return res.status(400).json({ error: 'Некорректный запрос.' });
    console.error(error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера.' });
});

const server = app.listen(port, host, (error) => {
    if (error) throw error;
    console.log(`Future Academy: http://${host}:${server.address().port}`);
});
