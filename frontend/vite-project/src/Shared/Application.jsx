import { useEffect, useRef, useState } from 'react';
import { Photos } from '../../../photo';
import { api, useSession } from '../api';

function ApplicationFields({ kind, subject, heading }) {
    const { user } = useSession();
    const [message, setMessage] = useState(null);
    const [pending, setPending] = useState(false);

    async function submit(event) {
        event.preventDefault();
        const form = event.currentTarget;
        setPending(true);
        setMessage(null);
        try {
            const result = await api('/applications', {
                ...Object.fromEntries(new FormData(form)), kind, subject,
            });
            setMessage({ id: result.id });
        } catch (failure) {
            setMessage({ error: failure.message });
        } finally {
            setPending(false);
        }
    }

    return (
        <form className="application-fields" onSubmit={submit}>
            {heading && <h2>{heading}</h2>}
            {message?.id ? <div className="page-section"><p className="form-success" role="status">Заявка №{message.id} сохранена.</p><button className="secondary" type="button" onClick={() => setMessage(null)}>Новая заявка</button></div> : <>
                <label>Ваше имя<input name="name" required minLength={2} maxLength={100} autoComplete="name" defaultValue={user?.name || ''} /></label>
                <div className="field-pair">
                    <label>Телефон<input name="phone" type="tel" required minLength={7} maxLength={32} autoComplete="tel" /></label>
                    <label>Email<input name="email" type="email" required maxLength={254} autoComplete="email" defaultValue={user?.email || ''} /></label>
                </div>
                {message?.error && <p className="form-error" role="alert">{message.error}</p>}
                <button className="action" disabled={pending}>{pending ? 'Отправляем…' : 'Отправить заявку'}</button>
            </>}
        </form>
    );
}

export function ApplicationBanner() {
    const { user } = useSession();
    return (
        <section className="application-banner">
            <div className="application-prompt">
                <img src={Photos.SovaTag} alt="" loading="lazy" />
                <div><h2>Помочь с выбором?</h2><p>Оставьте заявку на консультацию о программах и формате обучения.</p></div>
            </div>
            <ApplicationFields key={user?.id || 'anonymous'} kind="consultation" subject="Подбор программы обучения" />
        </section>
    );
}

export function ApplicationButton({ kind, subject, children }) {
    const [open, setOpen] = useState(false);
    return <>
        <button type="button" className="action" onClick={() => setOpen(true)}>{children}</button>
        {open && <ApplicationDialog kind={kind} subject={subject} close={() => setOpen(false)} />}
    </>;
}

function ApplicationDialog({ kind, subject, close }) {
    const ref = useRef(null);
    useEffect(() => { ref.current.showModal(); }, []);

    return (
        <dialog className="academy-dialog" ref={ref} onClose={close} aria-label="Заявка">
            <div className="dialog-top">
                <p className="eyebrow">Заявка</p>
                <button className="close-button" type="button" aria-label="Закрыть" onClick={() => ref.current.close()}>×</button>
            </div>
            <ApplicationFields kind={kind} subject={subject} heading={subject} />
        </dialog>
    );
}
