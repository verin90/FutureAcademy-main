import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import HeaderW from './Shared/HeaderWhite/HeaderW';
import Footer from './Shared/Footer/Footer';
import { ApplicationBanner } from './Shared/Application';
import { Missing } from './Shared/Blocks';
import Main from './Page/Main/Main';
import Catalog from './Page/Catalog/Catalog';
import Course from './Page/ChessSchool/ChessSchool';
import EventDetail from './Page/EventsP/EventDetail/EventDetail';
import Events from './Page/EventsP/Events';
import News from './Page/News/News';
import { Account, Auth } from './Page/Account';
import { About, Career, Contacts, Vacancies } from './Page/Information';
import Quiz from './Page/Quiz';
import { api, SessionContext } from './api';
import './App.css';

function Site() {
    const { pathname } = useLocation();
    const showBanner = !['/account', '/login', '/register', '/quiz'].includes(pathname);
    useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

    return <>
        <a className="skip-link" href="#main-content">К содержанию</a>
        <HeaderW />
        <main id="main-content" tabIndex={-1}>
            <Routes>
                <Route index element={<Main />} />
                <Route path="catalog" element={<Catalog />} />
                <Route path="course" element={<Navigate to="/catalog" replace />} />
                <Route path="courses/:id" element={<Course />} />
                <Route path="chessSchool" element={<Navigate to="/courses/chess" replace />} />
                <Route path="events" element={<Events />} />
                <Route path="events/:id" element={<EventDetail />} />
                <Route path="eventDetail" element={<Navigate to="/events/open-day" replace />} />
                <Route path="news" element={<News />} />
                <Route path="news/:id" element={<News />} />
                <Route path="knowledge" element={<News collection="knowledge" />} />
                <Route path="knowledge/:id" element={<News collection="knowledge" />} />
                <Route path="about" element={<About />} />
                <Route path="career" element={<Career />} />
                <Route path="career/vacancies" element={<Vacancies />} />
                <Route path="vacancies" element={<Navigate to="/career/vacancies" replace />} />
                <Route path="contacts" element={<Contacts />} />
                <Route path="quiz" element={<Quiz />} />
                <Route path="login" element={<Auth key="login" />} />
                <Route path="register" element={<Auth key="register" register />} />
                <Route path="registration" element={<Navigate to="/register" replace />} />
                <Route path="account" element={<Account />} />
                <Route path="*" element={<Missing />} />
            </Routes>
            {showBanner && <div className="shell"><ApplicationBanner /></div>}
        </main>
        <Footer />
    </>;
}

export default function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const controller = new AbortController();
        api('/me', undefined, controller.signal).then((data) => {
            if (!controller.signal.aborted) setUser(data.user);
        }).catch(() => {}).finally(() => { if (!controller.signal.aborted) setLoading(false); });
        return () => controller.abort();
    }, []);

    return <SessionContext.Provider value={{ user, setUser, loading }}>
        <BrowserRouter><Site /></BrowserRouter>
    </SessionContext.Provider>;
}
