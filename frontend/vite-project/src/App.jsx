import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HeaderW from '../src/Shared/HeaderWhite/HeaderW';
import Footer from '../src/Shared/Footer/Footer';
import Main from '../src/Page/Main/Main';
import Catalog from '../src/Page/Catalog/Catalog';
import ChessSchool from './Page/ChessSchool/ChessSchool';
import EventDetail from './Page/EventsP/EventDetail/EventDetail';
import Events from './Page/EventsP/Events';
import News from './Page/News/News';

function App() {
    return (
        <BrowserRouter>
            <HeaderW />
            <Routes>
                <Route path="/" index element={<Main />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/chessSchool" element={<ChessSchool />} />
                <Route path="/events" element={<Events />} />
                <Route path="/eventDetail" element={<EventDetail />} />
                <Route path="/news" element={<News />} />
            </Routes>
            <Footer />
        </BrowserRouter>
    );
}

export default App;
