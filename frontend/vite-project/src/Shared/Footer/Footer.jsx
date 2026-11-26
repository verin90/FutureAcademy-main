import { Link } from 'react-router-dom';
import { Photos } from '../../../../photo';
import { audiences, contacts, courses } from '../../content';

export default function Footer() {
    return <footer className="academy-footer">
        <div className="shell footer-grid">
            <div className="footer-contact">
                <Link to="/" aria-label="ХОД Future Academy, главная"><img src={Photos.Logo} alt="" /></Link>
                <a href={`tel:${contacts.tel}`}>{contacts.phone}</a>
                <p>{contacts.address}</p>
                <a href={`mailto:${contacts.email}`}>{contacts.email}</a>
                <small>© ХОД Future Academy</small>
            </div>
            {audiences.map((group) => <div key={group.id}>
                <h2>{group.name}</h2>
                <ul>{courses.filter((course) => course.audience === group.id).map((course) => (
                    <li key={course.id}><Link to={`/courses/${course.id}`}>{course.title}</Link></li>
                ))}</ul>
            </div>)}
            <div><h2>Информация</h2><ul>
                <li><Link to="/about">Об академии</Link></li>
                <li><Link to="/events">Мероприятия</Link></li>
                <li><Link to="/news">Новости</Link></li>
                <li><Link to="/knowledge">База знаний</Link></li>
                <li><Link to="/career">Карьера</Link></li>
                <li><Link to="/contacts">Контакты</Link></li>
            </ul></div>
        </div>
    </footer>;
}
