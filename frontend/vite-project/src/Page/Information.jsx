import { Link } from 'react-router-dom';
import { careers, contacts } from '../content';
import { ApplicationButton } from '../Shared/Application';
import { Breadcrumbs } from '../Shared/Blocks';

export function About() {
    return <div className="shell page-stack">
        <Breadcrumbs items={ [['Об академии']] } />
        <section className="feature-strip tone-blue"><div><h1>Об академии</h1>
            <p>ХОД Future Academy объединяет программы обучения программированию, дизайну, робототехнике и шахматам.</p></div>
            <Link className="action" to="/catalog">Выбрать программу</Link>
        </section>
        <section className="article"><h2>Как устроено обучение</h2>
            <p>Каждая программа разбита на блоки. В конце блока ученик применяет новые знания на практике: собирает страницу, решает задачу или дорабатывает свой проект.</p>
            <p>Курс можно подобрать по возрасту, уровню подготовки и продолжительности. Если вы ещё выбираете направление, начните с теста или консультации.</p>
            <Link to="/quiz">Подобрать направление</Link>
        </section>
    </div>;
}

export function Contacts() {
    return <div className="shell page-stack">
        <Breadcrumbs items={ [['Контакты']] } /><h1>Контакты</h1>
        <section className="feature-strip tone-blue">
            <dl className="detail-facts">
                <div><dt>Телефон</dt><dd><a href={`tel:${contacts.tel}`}>{contacts.phone}</a></dd></div>
                <div><dt>Email</dt><dd><a href={`mailto:${contacts.email}`}>{contacts.email}</a></dd></div>
                <div><dt>Адрес</dt><dd>{contacts.address}</dd></div>
            </dl>
            <a className="secondary" href={`https://yandex.ru/maps/?text=${encodeURIComponent(contacts.address)}`}>Открыть на карте</a>
        </section>
    </div>;
}

export function Career() {
    return <div className="shell page-stack">
        <Breadcrumbs items={ [['Карьера']] } />
        <section className="detail-hero chess-hero">
            <div><h1>Карьера в Future Academy</h1><p>Оставьте открытый отклик, если хотите участвовать в создании учебных программ или помогать студентам.</p>
                <ApplicationButton kind="career" subject="Открытый отклик">Оставить отклик</ApplicationButton></div>
            <Link className="secondary" to="/career/vacancies">Направления работы</Link>
        </section>
        <section className="page-section"><h2>С чего начать</h2>
            <p>Для первой работы в IT полезно иметь несколько проектов, в которых можно показать ход работы и результат.</p>
            <Link to="/news/projects">Как оформить портфолио</Link>
        </section>
    </div>;
}

export function Vacancies() {
    return <div className="shell page-stack">
        <Breadcrumbs items={ [['Карьера', '/career'], ['Направления работы']] } />
        <h1>Направления работы</h1>
        <p>Выберите направление для открытого отклика. Наличие вакансий уточняется после обращения.</p>
        <div className="accordion">{careers.map((item) => <details key={item.id}>
            <summary>{item.title}</summary><p>{item.intro}</p><ApplicationButton kind="career" subject={item.title}>Оставить отклик</ApplicationButton>
        </details>)}</div>
    </div>;
}
