import { useParams } from 'react-router-dom';
import { events } from '../../../content';
import { ApplicationButton } from '../../../Shared/Application';
import { Breadcrumbs, Missing } from '../../../Shared/Blocks';

export default function EventDetail() {
    const { id } = useParams();
    const event = events.find((item) => item.id === id);
    if (!event) return <Missing title="Мероприятие не найдено" to="/events" link="Все мероприятия" />;

    return <div className="shell page-stack">
        <Breadcrumbs items={ [['Мероприятия', '/events'], [event.title]] } />
        <section className={`detail-hero tone-${event.color}`}>
            <div><p className="eyebrow">{event.type}</p><h1>{event.title}</h1><p>{event.intro}</p>
                <ApplicationButton subject={event.title} kind="event">Записаться на мероприятие</ApplicationButton>
            </div>
            <dl className="detail-facts"><div><dt>Дата и место</dt><dd>Уточняются по заявке</dd></div><div><dt>Длительность</dt><dd>{event.duration}</dd></div></dl>
        </section>
        <section className="page-section"><h2>Программа мероприятия</h2>
            <div className="accordion">{event.agenda.map(([title, body], index) => <details key={title} open={index === 0}><summary>{title}</summary><p>{body}</p></details>)}</div>
        </section>
    </div>;
}
