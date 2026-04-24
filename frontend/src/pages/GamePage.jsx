import { useEffect, useState } from 'react';
import { fetchGameById, updateGameBoard, deleteGame } from '../services/sudokuService';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/game-page.css';

function cloneBoard(board) {
    return board.map((row) => [...row]);
}

function getBoardConfig(size) {
    if (size === 6) {
        return {
            minValue: 1,
            maxValue: 6,
            subgridRows: 2,
            subgridCols: 3
        };
    }

    return {
        minValue: 1,
        maxValue: 9,
        subgridRows: 3,
        subgridCols: 3
    };
}

function isBoardComplete(board, solution) {
    const size = board.length;

    for (let row = 0; row < size; row += 1) {
        for (let col = 0; col < size; col += 1) {
            if (board[row][col] !== solution[row][col]) {
                return false;
            }
        }
    }

    return true;
}

function isCellInvalid(board, row, col) {
    const value = board[row][col];
    if (value === 0) return false;

    const size = board.length;
    const { subgridRows, subgridCols } = getBoardConfig(size);

    for (let c = 0; c < size; c += 1) {
        if (c !== col && board[row][c] === value) {
            return true;
        }
    }

    for (let r = 0; r < size; r += 1) {
        if (r !== row && board[r][col] === value) {
            return true;
        }
    }

    const startRow = Math.floor(row / subgridRows) * subgridRows;
    const startCol = Math.floor(col / subgridCols) * subgridCols;

    for (let r = startRow; r < startRow + subgridRows; r += 1) {
        for (let c = startCol; c < startCol + subgridCols; c += 1) {
            if ((r !== row || c !== col) && board[r][c] === value) {
                return true;
            }
        }
    }

    return false;
}

function getCellBorderStyle(row, col, size) {
    const { subgridRows, subgridCols } = getBoardConfig(size);

    const style = {};

    if (row % subgridRows === 0) {
        style.borderTop = '2px solid #006d77';
    }

    if (col % subgridCols === 0) {
        style.borderLeft = '2px solid #006d77';
    }

    if ((row + 1) % subgridRows === 0) {
        style.borderBottom = '2px solid #006d77';
    }

    if ((col + 1) % subgridCols === 0) {
        style.borderRight = '2px solid #006d77';
    }

    return style;
}

function GamePage() {
    const { gameId } = useParams();
    const { isLoggedIn, username, authLoading } = useAuth();

    const [game, setGame] = useState(null);
    const [board, setBoard] = useState([]);
    const [initialBoard, setInitialBoard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');
    const [isCompleted, setIsCompleted] = useState(false);
    const navigate = useNavigate();

    const boardSize = board.length || 9;
    const boardPixelSize = boardSize === 6 ? 420 : 540;
    const { minValue, maxValue } = getBoardConfig(boardSize);

    useEffect(() => {
        async function loadGame() {
            try {
                setError('');
                const data = await fetchGameById(gameId);
                setGame(data);
                setBoard(cloneBoard(data.board));
                setInitialBoard(cloneBoard(data.initialBoard || data.board));
                setIsCompleted(Boolean(data.completed));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        loadGame();
    }, [gameId]);

    async function handleCellChange(rowIndex, colIndex, value) {
        if (!isLoggedIn || initialBoard[rowIndex][colIndex] !== 0 || isCompleted) {
            return;
        }

        if (value === '') {
            const updatedBoard = cloneBoard(board);
            updatedBoard[rowIndex][colIndex] = 0;
            setBoard(updatedBoard);
            return;
        }

        const numericValue = Number(value);

        if (
            !Number.isInteger(numericValue) ||
            numericValue < minValue ||
            numericValue > maxValue
        ) {
            return;
        }

        const updatedBoard = cloneBoard(board);
        updatedBoard[rowIndex][colIndex] = numericValue;
        setBoard(updatedBoard);

        const completedNow = isBoardComplete(updatedBoard, game.solution);

        if (completedNow) {
            try {
                setSaving(true);
                await updateGameBoard(gameId, updatedBoard, true);
                setIsCompleted(true);
                setSaveMessage('Puzzle completed and saved successfully.');
            } catch (err) {
                setSaveMessage(err.message);
            } finally {
                setSaving(false);
            }
        }
    }

    function handleReset() {
        setBoard(cloneBoard(initialBoard));
        setSaveMessage('');
    }

    async function handleSave() {
        if (!isLoggedIn) {
            setSaveMessage('Please log in to save progress.');
            return;
        }

        try {
            setSaving(true);
            setSaveMessage('');

            const completedNow = isBoardComplete(board, game.solution);
            await updateGameBoard(gameId, board, completedNow);

            setIsCompleted(completedNow);
            setSaveMessage(
                completedNow
                    ? 'Puzzle completed and saved successfully.'
                    : 'Progress saved successfully.'
            );
        } catch (err) {
            setSaveMessage(err.message);
        } finally {
            setSaving(false);
        }
    }

    async function handleDeleteGame() {
        const confirmed = window.confirm('Are you sure you want to delete this game? This cannot be undone.');

        if (!confirmed) {
            return;
        }

        try {
            await deleteGame(gameId);
            navigate('/games');
        } catch (err) {
            setSaveMessage(err.message);
        }
    }

    if (loading || authLoading) {
        return (
            <main className="game-page">
                <p className="game-page__message">Loading game...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="game-page">
                <p className="game-page__error">{error}</p>
            </main>
        );
    }

    if (!game) {
        return (
            <main className="game-page">
                <p className="game-page__message">Game not found.</p>
            </main>
        );
    }

    return (
        <main className="game-page">
            <section className="game-page__header">
                <h1 className="game-page__title">{game.name}</h1>
                <p className="game-page__meta">
                    <strong>Difficulty:</strong> {game.difficulty}
                </p>
                <p className="game-page__meta">
                    <strong>Created by:</strong> {game.creatorUsername}
                </p>
                <p className="game-page__meta">
                    <strong>Status:</strong> {isCompleted ? 'Completed' : 'In Progress'}
                </p>
                {!isLoggedIn && (
                    <p className="game-page__message">
                        You can view this puzzle while logged out, but you must log in to play and save progress.
                    </p>
                )}
            </section>

            <section className="game-board-card">
                <div
                    className="sudoku-board"
                    style={{
                        gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
                        width: `min(100%, ${boardPixelSize}px)`
                    }}
                >
                    {board.map((row, rowIndex) =>
                        row.map((cell, colIndex) => {
                            const isFixed = initialBoard[rowIndex][colIndex] !== 0;
                            const isInvalid = isCellInvalid(board, rowIndex, colIndex);

                            const conflictClass = isInvalid
                                ? isFixed
                                    ? 'sudoku-cell--fixed-conflict'
                                    : 'sudoku-cell--editable-conflict'
                                : '';

                            return (
                                <input
                                    key={`${rowIndex}-${colIndex}`}
                                    className={`sudoku-cell ${
                                        isFixed ? 'sudoku-cell--fixed' : 'sudoku-cell--editable'
                                    } ${conflictClass}`}
                                    style={getCellBorderStyle(rowIndex, colIndex, boardSize)}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength="1"
                                    value={cell === 0 ? '' : cell}
                                    readOnly={!isLoggedIn || isFixed || isCompleted}
                                    onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                                />
                            );
                        })
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

                    <button className="game-page__button" type="button" onClick={handleReset}>
                        Reset Game
                    </button>

                    {isLoggedIn && (
                        <button
                            className="game-page__button"
                            type="button"
                            onClick={handleSave}
                            disabled={saving}
                        >
                            {saving ? 'Saving...' : 'Save Progress'}
                        </button>
                    )}

                    {isLoggedIn && game.creatorUsername === username && (
                        <button
                            className="game-page__button game-page__button--danger"
                            type="button"
                            onClick={handleDeleteGame}
                        >
                            Delete Game
                        </button>
                    )}
                </div>

                {saveMessage && <p className="game-page__message">{saveMessage}</p>}
                {isCompleted && (
                    <p className="game-page__success">
                        Congratulations! You solved this puzzle.
                    </p>
                )}
            </section>
        </main>
    );
}

export default GamePage;