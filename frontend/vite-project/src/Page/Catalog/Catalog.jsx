import { Link, useSearchParams } from 'react-router-dom';
import { audiences, courses, levels, types } from '../../content';
import { Tiles } from '../../Shared/Blocks';

export default function Catalog() {
    const [params, setParams] = useSearchParams();
    const audience = audiences.find((item) => item.id === params.get('audience')) || audiences[0];
    const available = courses.filter((course) => course.audience === audience.id);
    const directions = [...new Set(available.map((course) => course.direction))];
    const direction = params.get('direction') || '';
    const level = params.get('level') || '';
    const type = params.get('type') || '';
    const duration = Math.min(24, Math.max(1, Number(params.get('duration')) || 24));
    const matching = available.filter((course) => (!direction || course.direction === direction)
        && (!level || levels[course.level] === level)
        && (!type || types[course.type] === type) && course.months <= duration);

    function update(key, value) {
        setParams((previous) => {
            const next = new URLSearchParams(previous);
            if (value) next.set(key, value);
            else next.delete(key);
            return next;
        }, { replace: true });
    }

    return <div className="shell page-stack">
        <h1>Все программы обучения</h1>
        <nav className="audiences" aria-label="Возраст учащихся">
            {audiences.map((group) => (
                <Link className={group.id === audience.id ? 'chosen' : ''} to={`/catalog?audience=${group.id}`} aria-current={group.id === audience.id ? 'true' : undefined} key={group.id}>
                    <img src={group.icon} alt="" /><span><strong>{group.name}</strong><small>{group.age}</small></span>
                </Link>
            ))}
        </nav>
        <div className="catalog">
            <aside className="filters" aria-label="Фильтры каталога">
                <h2>Фильтры</h2>
                <label>Уровень сложности<select value={level} onChange={(event) => update('level', event.target.value)}><option value="">Любой уровень</option>{levels.map((item) => <option key={item}>{item}</option>)}</select></label>
                <label>Тип обучения<select value={type} onChange={(event) => update('type', event.target.value)}><option value="">Любой тип</option>{types.map((item) => <option key={item}>{item}</option>)}</select></label>
                <label>Длительность до {duration} мес.<input aria-label="Максимальная длительность" type="range" min="1" max="24" value={duration}
                    onChange={(event) => update('duration', event.target.value === '24' ? '' : event.target.value)} /></label>
                <button type="button" className="secondary" onClick={() => setParams({ audience: audience.id })}>Сбросить фильтры</button>
            </aside>
            <section className="catalog-results">
                <h2>Направления</h2>
                <div className="chips">
                    <button type="button" className="chip" aria-pressed={!direction} onClick={() => update('direction', '')}>Все направления</button>
                    {directions.map((item) => <button className="chip" type="button" key={item} aria-pressed={item === direction} onClick={() => update('direction', direction === item ? '' : item)}>{item}</button>)}
                </div>
                <p aria-live="polite">Программ найдено: {matching.length}</p>
                {matching.length ? <Tiles items={matching} base="/courses" label={(course) => types[course.type]} /> : <p>Попробуйте изменить фильтры.</p>}
            </section>
        </div>
    </div>;
}
