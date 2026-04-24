import { useEffect, useState } from 'react';
import { fetchHighScores } from '../services/highscoreService';
import '../styles/scores.css';

function ScoresPage() {
    const [scores, setScores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function loadScores() {
            try {
                setError('');
                const data = await fetchHighScores();
                setScores(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        loadScores();
    }, []);

    if (loading) {
        return (
            <main className="scores-page">
                <section className="scores-page__card">
                    <h1 className="scores-page__title">High Scores</h1>
                    <p>Loading scores...</p>
                </section>
            </main>
        );
    }

    if (error) {
        return (
            <main className="scores-page">
                <section className="scores-page__card">
                    <h1 className="scores-page__title">High Scores</h1>
                    <p className="scores-page__error">{error}</p>
                </section>
            </main>
        );
    }

    return (
        <main className="scores-page">
            <section className="scores-page__card">
                <h1 className="scores-page__title">High Scores</h1>

                {scores.length === 0 ? (
                    <p>No completed games yet.</p>
                ) : (
                    <table className="scores-table">
                        <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Username</th>
                            <th>Wins</th>
                        </tr>
                        </thead>
                        <tbody>
                        {scores.map((score, index) => (
                            <tr key={score.username}>
                                <td>{index + 1}</td>
                                <td>{score.username}</td>
                                <td>{score.wins}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </section>
        </main>
    );
}

export default ScoresPage;