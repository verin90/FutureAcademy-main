import { useState } from 'react';
import { Link } from 'react-router-dom';
import { audiences, courses } from '../content';

const questions = [
    { title: 'Для кого подбираем программу?', options: audiences.map((item) => item.name) },
    { title: 'Что вам больше нравится?', options: ['Писать код', 'Придумывать и оформлять', 'Решать задачи'] },
    { title: 'Как долго вы хотите учиться?', options: ['До полугода', 'Готов(а) заниматься дольше'] },
];

const order = [
    [['scratch', 'robotics'], ['digital-design', 'scratch'], ['chess', 'robotics']],
    [['web', 'mobile'], ['3d', 'unity'], ['mobile', 'web']],
    [['python', 'java'], ['design', 'java'], ['qa', 'java']],
];

export default function Quiz() {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState([]);
    if (step === questions.length) {
        const candidates = order[answers[0]][answers[1]].map((id) => courses.find((course) => course.id === id));
        const available = courses.filter((course) => course.audience === audiences[answers[0]].id);
        const course = answers[2] === 0 ? [...candidates, ...available].find((item) => item.months <= 6) : candidates[0];
        return <div className="shell page-stack"><h1>Ваше направление</h1>
            <section className={`feature-strip tone-${course.color}`}><div><h2>{course.title}</h2><p>{course.intro}</p></div><Link className="action" to={`/courses/${course.id}`}>Открыть курс</Link></section>
            <button className="secondary" onClick={() => { setAnswers([]); setStep(0); }}>Начать заново</button>
        </div>;
    }
    const question = questions[step];
    return <div className="shell page-stack">
        <h1>Подбор программы</h1>
        <form className="quiz" onSubmit={(event) => { event.preventDefault(); if (answers[step] !== undefined) setStep(step + 1); }}>
            <p className="eyebrow">Вопрос {step + 1} из {questions.length}</p>
            <fieldset><legend>{question.title}</legend>{question.options.map((choice, index) => <label className="quiz-choice" key={choice}>
                <input type="radio" name="answer" checked={answers[step] === index} onChange={() => {
                    const next = [...answers];
                    next[step] = index;
                    setAnswers(next);
                }} />{choice}
            </label>)}</fieldset>
            <div className="section-line">
                {step > 0 && <button className="secondary" type="button" onClick={() => setStep(step - 1)}>Назад</button>}
                <button className="action" disabled={answers[step] === undefined}>{step === questions.length - 1 ? 'Показать результат' : 'Далее'}</button>
            </div>
        </form>
    </div>;
}
