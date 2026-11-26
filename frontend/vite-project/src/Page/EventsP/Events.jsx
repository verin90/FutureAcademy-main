import { Link } from 'react-router-dom';
import { useState } from 'react';
import { events } from '../../content';
import { Breadcrumbs, Tiles } from '../../Shared/Blocks';

export default function Events() {
    const [type, setType] = useState('');
    const [featured, ...others] = events;
    const options = [...new Set(events.map((event) => event.type))];
    const list = type ? events.filter((event) => event.type === type) : others;

    return <div className="shell page-stack">
        <Breadcrumbs items={ [['Мероприятия']] } />
        <h1>Все мероприятия</h1>
        <section className="feature-strip tone-yellow">
            <div><p className="eyebrow">{featured.type}</p><h2>{featured.title}</h2><p>{featured.intro}</p></div>
            <Link className="secondary" to={`/events/${featured.id}`}>Смотреть программу</Link>
        </section>
        <div className="chips" aria-label="Формат мероприятия">
            {['', ...options].map((option) => <button type="button" className="chip" aria-pressed={option === type} key={option} onClick={() => setType(option)}>{option || 'Все форматы'}</button>)}
        </div>
        <Tiles items={list} base="/events" />
    </div>;
}
