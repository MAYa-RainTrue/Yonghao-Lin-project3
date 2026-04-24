import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import GamesPage from './pages/GamesPage';
import RulesPage from './pages/RulesPage';
import ScoresPage from './pages/ScoresPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import GamePage from './pages/GamePage';
import CustomGamePage from './pages/CustomGamePage';

function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/games" element={<GamesPage />} />
                <Route path="/custom" element={<CustomGamePage />} />
                <Route path="/rules" element={<RulesPage />} />
                <Route path="/scores" element={<ScoresPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/game/:gameId" element={<GamePage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;