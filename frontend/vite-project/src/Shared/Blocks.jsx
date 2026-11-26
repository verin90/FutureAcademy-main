import { Link } from 'react-router-dom';

export function Breadcrumbs({ items }) {
    return <nav className="breadcrumbs" aria-label="Путь к странице">
        <Link to="/">Главная</Link>{items.map(([label, route]) => (
            <span key={label}><span aria-hidden="true"> / </span>{route ? <Link to={route}>{label}</Link> : <span aria-current="page">{label}</span>}</span>
        ))}
    </nav>;
}

export function Tiles({ items, base, label }) {
    return <div className="tile-grid">{items.map((item) => (
        <Link className={`tile tone-${item.color || 'blue'}`} to={`${base}/${item.id}`} key={item.id}>
            <span className="eyebrow">{label ? label(item) : item.category || item.type}</span>
            <h2>{item.title}</h2><p>{item.intro}</p>
            {item.months && <small>{item.months} мес.</small>}
        </Link>
    ))}</div>;
}

export function Missing({ title = 'Страница не найдена', to = '/', link = 'На главную' }) {
    return <div className="shell page-stack"><h1>{title}</h1><p><Link to={to}>{link}</Link></p></div>;
}
