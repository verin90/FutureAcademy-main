import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { audiences, courses, levels, types } from '../../content';
import { ApplicationButton } from '../../Shared/Application';
import { Breadcrumbs, Missing } from '../../Shared/Blocks';

const durations = [
    { months: 6, price: '4 350 ₽' }, { months: 12, price: '3 900 ₽' }, { months: 24, price: '3 500 ₽' },
];

export default function Course() {
    const { id } = useParams();
    const course = courses.find((item) => item.id === id);
    if (!course) return <Missing title="Курс не найден" to="/catalog" link="Все курсы" />;
    return <CourseDetail key={course.id} course={course} />;
}

function CourseDetail({ course }) {
    const [duration, setDuration] = useState(durations[0]);
    const chess = course.id === 'chess';
    const audience = audiences.find((group) => group.id === course.audience);
    return <div className="shell page-stack">
        <Breadcrumbs items={ [['Все курсы', '/catalog'], [course.title]] } />
        <section className={`detail-hero ${chess ? 'chess-hero' : 'tone-' + course.color}`}>
            <div>
                <p className="eyebrow">{types[course.type]} · {course.direction}</p><h1>{course.title}</h1><p>{course.intro}</p>
                <ApplicationButton kind="course" subject={course.title}>{chess ? 'Записаться на пробный урок' : 'Записаться на курс'}</ApplicationButton>
            </div>
            {chess ? <div className="chess-art" aria-hidden="true"><span>♞</span><span>♟</span></div> : <dl className="detail-facts">
                <div><dt>Для кого</dt><dd>{audience.name} · {audience.age}</dd></div>
                <div><dt>Уровень</dt><dd>{levels[course.level]}</dd></div>
                <div><dt>Длительность</dt><dd>{course.months} мес.</dd></div>
            </dl>}
        </section>
        <section className="page-section"><h2>Содержание курса</h2>
            <ol className="module-list">{course.modules.map((item) => <li key={item}>{item}</li>)}</ol>
        </section>
        {chess && <section className="feature-strip tone-blue">
            <div className="page-section"><h2>Продолжительность и стоимость</h2>
                <div className="chips">{durations.map((item) => <button key={item.months} className="chip" type="button"
                    aria-pressed={duration.months === item.months} onClick={() => setDuration(item)}>{item.months} мес.</button>)}</div>
                <p><strong>{duration.price} в месяц</strong> · ориентир из программы</p>
            </div>
            <ApplicationButton kind="course" subject={`${course.title} · ${duration.months} мес.`}>Записаться на курс</ApplicationButton>
        </section>}
        <section className="page-section"><h2>Частые вопросы</h2><div className="accordion">
            <details><summary>Кому подойдёт программа?</summary><p>{audience.name}, {audience.age.toLowerCase()}. Уровень подготовки — {levels[course.level].toLowerCase()}.</p></details>
            <details><summary>Как узнать расписание занятий?</summary><p>Укажите контакты в заявке на курс, чтобы уточнить формат и расписание.</p></details>
        </div></section>
    </div>;
}
