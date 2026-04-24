import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCustomGame } from '../services/sudokuService';
import { useAuth } from '../context/AuthContext.jsx';
import '../styles/game-page.css';

function createEmptyBoard() {
    return Array.from({ length: 9 }, () => Array(9).fill(0));
}

function getCellBorderStyle(row, col) {
    const style = {};

    if (row % 3 === 0) {
        style.borderTop = '2px solid #006d77';
    }

    if (col % 3 === 0) {
        style.borderLeft = '2px solid #006d77';
    }

    if ((row + 1) % 3 === 0) {
        style.borderBottom = '2px solid #006d77';
    }

    if ((col + 1) % 3 === 0) {
        style.borderRight = '2px solid #006d77';
    }

    return style;
}

function CustomGamePage() {
    const navigate = useNavigate();
    const { isLoggedIn, authLoading } = useAuth();

    const [board, setBoard] = useState(createEmptyBoard());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    function handleChange(rowIndex, colIndex, value) {
        if (!isLoggedIn) {
            return;
        }

        if (value === '') {
            const updatedBoard = board.map((row) => [...row]);
            updatedBoard[rowIndex][colIndex] = 0;
            setBoard(updatedBoard);
            return;
        }

        const numberValue = Number(value);

        if (!Number.isInteger(numberValue) || numberValue < 1 || numberValue > 9) {
            return;
        }

        const updatedBoard = board.map((row) => [...row]);
        updatedBoard[rowIndex][colIndex] = numberValue;
        setBoard(updatedBoard);
    }

    function handleClear() {
        if (!isLoggedIn) {
            return;
        }

        setBoard(createEmptyBoard());
        setError('');
    }

    async function handleSubmit() {
        if (!isLoggedIn) {
            setError('Please log in to create a custom game.');
            return;
        }

        try {
            setLoading(true);
            setError('');

            const result = await createCustomGame(board);
            navigate(`/game/${result.gameId}`);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    if (authLoading) {
        return (
            <main className="game-page">
                <p className="game-page__message">Loading...</p>
            </main>
        );
    }

    return (
        <main className="game-page">
            <section className="game-page__header">
                <h1 className="game-page__title">Create Custom Game</h1>
                <p className="game-page__meta">
                    Enter a 9x9 Sudoku puzzle. Leave blank cells empty. The puzzle must have exactly one solution.
                </p>

                {!isLoggedIn && (
                    <p className="game-page__message">
                        You can view this page while logged out, but you must log in to create a custom game.
                    </p>
                )}
            </section>

            <section className="game-board-card">
                <div
                    className="sudoku-board"
                    style={{
                        gridTemplateColumns: 'repeat(9, 1fr)',
                        width: 'min(100%, 540px)'
                    }}
                >
                    {board.map((row, rowIndex) =>
                        row.map((cell, colIndex) => (
                            <input
                                key={`${rowIndex}-${colIndex}`}
                                className="sudoku-cell sudoku-cell--editable"
                                style={getCellBorderStyle(rowIndex, colIndex)}
                                type="text"
                                inputMode="numeric"
                                maxLength="1"
                                value={cell === 0 ? '' : cell}
                                readOnly={!isLoggedIn}
                                onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)}
                            />
                        ))
                    )}
                </div>

                <div className="game-page__actions">
                    <button
                        className="game-page__button game-page__button--secondary"
                        type="button"
                        onClick={() => navigate('/games')}
                    >
                        Back to Games
                    </button>

                    <button
                        className="game-page__button"
                        type="button"
                        onClick={handleClear}
                        disabled={loading || !isLoggedIn}
                    >
                        Clear Board
                    </button>

                    <button
                        className="game-page__button"
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading || !isLoggedIn}
                    >
                        {loading ? 'Creating...' : 'Create Game'}
                    </button>
                </div>

                {error && <p className="game-page__error">{error}</p>}
            </section>
        </main>
    );
}

export default CustomGamePage;