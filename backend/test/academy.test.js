const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const { once } = require('node:events');
const { mkdtemp, rm } = require('node:fs/promises');
const { tmpdir } = require('node:os');
const { dirname, join, resolve } = require('node:path');
const { createInterface } = require('node:readline');
const { test } = require('node:test');

async function startServer(dataDir) {
    const child = spawn(process.execPath, [join(__dirname, '..', 'index.js')], {
        env: { ...process.env, PORT: '0', FUTURE_DATA_DIR: dataDir, FUTURE_HOST: '127.0.0.1', FUTURE_SECURE_COOKIE: '0' },
        stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true,
    });
    const stopped = once(child, 'exit');
    let errors = '';
    child.stderr.on('data', (chunk) => { errors += chunk; });
    const lines = createInterface({ input: child.stdout });
    for await (const line of lines) {
        if (line.startsWith('Future Academy: ')) {
            return {
                origin: line.slice('Future Academy: '.length),
                async close() {
                    if (child.exitCode === null && child.signalCode === null) child.kill();
                    await stopped;
                },
            };
        }
    }
    await stopped;
    throw new Error(errors || 'Проверочный сервер завершился до запуска.');
}

test('Сессии и заявки сохраняются после перезапуска и видны только владельцу', { timeout: 15000 }, async () => {
    const temporaryRoot = resolve(tmpdir());
    const directory = await mkdtemp(join(temporaryRoot, 'future-academy-test-'));
    assert.equal(dirname(resolve(directory)), temporaryRoot);
    let server;

    async function request(path, { body, cookie, status = 200 } = {}) {
        const response = await fetch(server.origin + '/api/' + path, {
            method: body ? 'POST' : 'GET',
            headers: { ...(body && { 'Content-Type': 'application/json' }), ...(cookie && { Cookie: cookie }) },
            body: body && JSON.stringify(body),
        });
        const data = response.status === 204 ? null : await response.json();
        assert.equal(response.status, status, `${path}: ${JSON.stringify(data)}`);
        return { data, setCookie: response.headers.get('set-cookie') };
    }

    const password = 'Academy-test-password';
    const first = { name: 'Первый аккаунт', email: 'first@example.test', password };
    const application = {
        kind: 'course', subject: 'Веб-разработка', name: first.name, email: first.email, phone: '+79990000000',
    };

    try {
        server = await startServer(directory);
        assert.equal((await request('me')).data.user, null);
        await request('register', { body: { ...first, password: 'bad' }, status: 400 });
        const registration = await request('register', { body: first, status: 201 });
        assert.match(registration.setCookie, /HttpOnly/i);
        assert.match(registration.setCookie, /SameSite=Lax/i);
        assert.ok(!('password_hash' in registration.data.user));
        const cookie = registration.setCookie.split(';')[0];
        await request('register', { body: { ...first, email: first.email.toUpperCase() }, status: 409 });
        await request('applications', { status: 401 });
        await request('applications', { body: { ...application, phone: 'abc' }, cookie, status: 400 });
        const saved = await request('applications', { body: application, cookie, status: 201 });
        await request('applications', { body: { ...application, kind: 'consultation', subject: 'Гостевая заявка' }, status: 201 });
        const second = await request('register', { body: { ...first, email: 'second@example.test' }, status: 201 });
        assert.deepEqual((await request('applications', { cookie: second.setCookie.split(';')[0] })).data, []);
        await server.close();
        server = await startServer(directory);
        assert.equal((await request('me', { cookie })).data.user.email, first.email);
        const own = (await request('applications', { cookie })).data;
        assert.equal(own.length, 1);
        assert.equal(own[0].id, saved.data.id);
        await request('logout', { body: {}, cookie, status: 204 });
        await request('applications', { cookie, status: 401 });
        await request('login', { body: { email: first.email, password: 'Wrong-pass!' }, status: 401 });
        const login = await request('login', { body: { email: first.email, password } });
        assert.equal(login.data.user.id, registration.data.user.id);
    } finally {
        await server?.close();
        await rm(directory, { recursive: true, force: true, maxRetries: 3 });
    }
});
