import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createGame, fetchAllGames } from '../services/sudokuService';
import { useAuth } from '../context/AuthContext.jsx';
import '../styles/games.css';

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

function GamesPage() {
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();

    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState('');

    async function loadGames() {
        try {
            setError('');
            const data = await fetchAllGames();
            setGames(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadGames();
    }, []);

    async function handleCreateGame(difficulty) {
        if (!isLoggedIn) {
            setError('Please log in to create games.');
            return;
        }

        try {
            setCreating(true);
            setError('');

            const createdGame = await createGame(difficulty);
            await loadGames();

            if (createdGame.gameId) {
                navigate(`/game/${createdGame.gameId}`);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setCreating(false);
        }
    }

    return (
        <main className="games-page">
            <section className="games-hero">
                <h1 className="games-title">Game Selection</h1>
                <p className="games-subtitle">
                    Create a new Sudoku game, create a custom puzzle, or continue from an existing one.
                </p>

                {!isLoggedIn && (
                    <p className="games-message">
                        You can browse existing games while logged out. Log in to create or play games.
                    </p>
                )}

                <div className="games-actions">
                    <button
                        className="games-button"
                        type="button"
                        onClick={() => handleCreateGame('NORMAL')}
                        disabled={creating || !isLoggedIn}
                    >
                        {creating ? 'Creating...' : 'Create Normal Game'}
                    </button>

                    <button
                        className="games-button"
                        type="button"
                        onClick={() => handleCreateGame('EASY')}
                        disabled={creating || !isLoggedIn}
                    >
                        {creating ? 'Creating...' : 'Create Easy Game'}
                    </button>

                    <button
                        className="games-button"
                        type="button"
                        onClick={() => navigate('/custom')}
                        disabled={creating || !isLoggedIn}
                    >
                        Create Custom Game
                    </button>
                </div>
            </section>

            <section className="games-list-section">
                <h2 className="games-list-title">Available Games</h2>

                {error && <p className="games-error">{error}</p>}

                {loading ? (
                    <p className="games-message">Loading games...</p>
                ) : games.length === 0 ? (
                    <p className="games-message">No games yet. Log in to create the first one.</p>
                ) : (
                    <div className="games-list">
                        {games.map((game) => (
                            <article key={game._id} className="game-card">
                                <h3 className="game-card__title">{game.name}</h3>

                                <p className="game-card__meta">
                                    <strong>Difficulty:</strong> {game.difficulty}
                                </p>

                                <p className="game-card__meta">
                                    <strong>Created by:</strong> {game.creatorUsername}
                                </p>

                                <p className="game-card__meta">
                                    <strong>Created:</strong> {formatDate(game.createdAt)}
                                </p>

                                <button
                                    className="game-card__button"
                                    type="button"
                                    onClick={() => navigate(`/game/${game._id}`)}
                                >
                                    Open Game
                                </button>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}

export default GamesPage;