import { Link } from 'react-router-dom';
import { audiences, courses, events, news } from '../../content';
import { Tiles } from '../../Shared/Blocks';

export default function Main() {
    const openDay = events[0];
    return <>
        <section className="home-hero">
            <div className="shell home-hero-inner">
                <h1>Образовательная платформа ХОД Future Academy</h1>
                <p>Практические программы для детей, подростков и взрослых.</p>
                <Link className="action" to="/catalog">В каталог курсов</Link>
            </div>
        </section>
        <div className="shell page-stack">
            <section className="page-section">
                <h2>Кем вы хотите стать?</h2>
                <div className="audiences">{audiences.map((group) => <Link to={`/catalog?audience=${group.id}`} key={group.id}>
                    <img src={group.icon} alt="" /><span><strong>{group.name}</strong><small>{group.age}</small></span>
                </Link>)}</div>
                <Tiles items={[courses[0], courses[4], courses[8]]} base="/courses" label={(course) => course.direction} />
            </section>
            <section className="feature-strip tone-yellow">
                <div><p className="eyebrow">{openDay.type}</p><h2>{openDay.title}</h2><p>{openDay.intro}</p></div>
                <Link to={`/events/${openDay.id}`} className="secondary">О мероприятии</Link>
            </section>
            <section className="page-section">
                <div className="section-line"><h2>Новости Академии</h2><Link to="/news">Все новости</Link></div>
                <Tiles items={news} base="/news" />
            </section>
            <section className="feature-strip tone-lilac">
                <div><h2>Какое направление вам подойдёт?</h2><p>Ответьте на три вопроса и получите рекомендацию курса.</p></div>
                <Link to="/quiz" className="secondary">Пройти тест</Link>
            </section>
        </div>
    </>;
}
