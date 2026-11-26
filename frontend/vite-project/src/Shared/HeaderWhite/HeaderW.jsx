import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Photos } from '../../../../photo';
import { useSession } from '../../api';
import { contacts } from '../../content';

const cities = ['Нижний Новгород', 'Москва', 'Казань'];
const pages = [
    ['/catalog', 'Все курсы'], ['/events', 'Мероприятия'], ['/knowledge', 'База знаний'],
    ['/career', 'Карьера'], ['/news', 'Новости'], ['/contacts', 'Контакты'],
];

export default function HeaderW() {
    const location = useLocation();
    const [openAt, setOpenAt] = useState(null);
    const [city, setCity] = useState(() => {
        const previous = localStorage.getItem('future-city');
        return cities.includes(previous) ? previous : cities[0];
    });
    const { user } = useSession();
    const open = openAt === location.key;

    function changeCity(event) {
        const next = event.target.value;
        setCity(next);
        localStorage.setItem('future-city', next);
    }

    return <header className="academy-header">
        <div className="shell header-inner">
            <Link to="/" className="academy-logo" aria-label="ХОД Future Academy, главная"><img src={Photos.Logo} alt="" /></Link>
            <button type="button" className="menu-toggle" aria-expanded={open} aria-controls="header-links" onClick={() => setOpenAt(open ? null : location.key)}>
                {open ? 'Закрыть меню' : 'Меню'}
            </button>
            <div id="header-links" className={`header-links${open ? ' open' : ''}`}>
                <nav aria-label="Основная навигация">
                    {pages.map(([path, label]) => <NavLink key={path} to={path} onClick={() => setOpenAt(null)}>{label}</NavLink>)}
                </nav>
                <div className="header-actions">
                    <label><span className="sr-only">Ваш город</span><select value={city} onChange={changeCity}>{cities.map((name) => <option key={name}>{name}</option>)}</select></label>
                    <a href={`tel:${contacts.tel}`}>{contacts.phone}</a>
                    <NavLink to={user ? '/account' : '/login'} onClick={() => setOpenAt(null)}>{user ? 'Личный кабинет' : 'Войти'}</NavLink>
                </div>
            </div>
        </div>
    </header>;
}
