import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { api, useSession } from '../api';

export function Auth({ register = false }) {
    const { user, setUser, loading } = useSession();
    const navigate = useNavigate();
    const [failure, setFailure] = useState('');
    const [busy, setBusy] = useState(false);
    if (loading) return <div className="shell page-stack"><p role="status">Проверяем сессию…</p></div>;
    if (user) return <Navigate to="/account" replace />;

    async function submit(event) {
        event.preventDefault();
        setBusy(true);
        setFailure('');
        try {
            const { user: account } = await api(register ? '/register' : '/login', Object.fromEntries(new FormData(event.currentTarget)));
            setUser(account);
            navigate('/account', { replace: true });
        } catch (error) {
            setFailure(error.message);
        } finally {
            setBusy(false);
        }
    }

    return <div className="shell page-stack">
        <div className="account-box">
            <nav className="auth-nav" aria-label="Доступ к аккаунту"><Link aria-current={!register ? 'page' : undefined} to="/login">Вход</Link><Link aria-current={register ? 'page' : undefined} to="/register">Регистрация</Link></nav>
            <h1>{register ? 'Регистрация' : 'Вход в личный кабинет'}</h1>
            <form key={register ? 'register' : 'login'} className="application-fields" onSubmit={submit}>
                {register && <label>Ваше имя<input name="name" required minLength={2} maxLength={100} autoComplete="name" /></label>}
                <label>Email<input name="email" type="email" required maxLength={254} autoComplete="username" /></label>
                <label>Пароль<input name="password" type="password" required minLength={register ? 8 : undefined} autoComplete={register ? 'new-password' : 'current-password'} /></label>
                {register && <small>Не менее 8 символов.</small>}
                {failure && <p className="form-error" role="alert">{failure}</p>}
                <button className="action" disabled={busy}>{busy ? 'Подождите…' : register ? 'Создать аккаунт' : 'Войти'}</button>
            </form>
        </div>
    </div>;
}

export function Account() {
    const { user, loading, setUser } = useSession();
    if (loading) return <div className="shell page-stack"><p role="status">Проверяем сессию…</p></div>;
    return user ? <AccountPage key={user.id} user={user} setUser={setUser} /> : <Navigate to="/login" replace />;
}

const applicationTypes = { consultation: 'Консультация', course: 'Курс', event: 'Мероприятие', career: 'Карьера' };

function AccountPage({ user, setUser }) {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [revision, setRevision] = useState(0);
    const [logoutError, setLogoutError] = useState('');

    useEffect(() => {
        const controller = new AbortController();
        api('/applications', undefined, controller.signal).then((items) => setData({ items })).catch((error) => {
            if (!controller.signal.aborted) setData({ error: error.message });
        });
        return () => controller.abort();
    }, [revision]);

    async function logout() {
        setLogoutError('');
        try {
            await api('/logout', {});
            setUser(null);
            navigate('/login', { replace: true });
        } catch (error) {
            setLogoutError(error.message);
        }
    }

    return <div className="shell page-stack">
        <div className="section-line"><h1>Личный кабинет</h1><button type="button" className="secondary" onClick={logout}>Выйти</button></div>
        {logoutError && <p role="alert" className="form-error">{logoutError}</p>}
        <div className="account-meta"><strong>{user.name}</strong><span>{user.email}</span></div>
        <section className="page-section"><h2>Мои заявки</h2>
            {!data && <p role="status">Загружаем заявки…</p>}
            {data?.error && <p role="alert">{data.error} <button className="secondary" onClick={() => { setData(null); setRevision(revision + 1); }}>Повторить</button></p>}
            {data?.items?.length === 0 && <p>Здесь появятся заявки, отправленные из вашего аккаунта.</p>}
            {data?.items?.length > 0 && <ul className="request-list">{data.items.map((item) => <li key={item.id}>
                <div><strong>{item.subject}</strong><p>{applicationTypes[item.kind]}</p></div>
                <time dateTime={item.created_at.replace(' ', 'T') + 'Z'}>{new Intl.DateTimeFormat('ru-RU').format(new Date(item.created_at.replace(' ', 'T') + 'Z'))}</time>
            </li>)}</ul>}
        </section>
    </div>;
}
