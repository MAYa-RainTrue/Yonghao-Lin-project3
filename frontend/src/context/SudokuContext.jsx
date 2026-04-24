import { createContext, useContext, useMemo, useState } from 'react';
import { createEasyPuzzle, createNormalPuzzle } from '../utils/puzzleFactory';
import { validateBoard } from '../utils/validation';

const SudokuContext = createContext(null);

function cloneBoard(board) {
    return board.map((row) => row.map((cell) => ({ ...cell })));
}

function createInitialGame(mode = 'easy') {
    const puzzle = mode === 'easy' ? createEasyPuzzle() : createNormalPuzzle();

    return {
        mode,
        size: mode === 'easy' ? 6 : 9,
        board: cloneBoard(puzzle.board),
        initialBoard: cloneBoard(puzzle.board),
        solution: puzzle.solution,
        selectedCell: null,
        status: 'playing',
        secondsElapsed: 0,
    };
}

export function SudokuProvider({ children }) {
    // Provider component for gameState and other functions
    const [gameState, setGameState] = useState(createInitialGame('easy'));

    // Select cell on the board, record which cell is selected
    const selectCell = (row, col) => {
        setGameState((prev) => ({
            ...prev,
            selectedCell: { row, col },
        }));
    };

    // Set game mode
    const setMode = (mode) => {
        setGameState(createInitialGame(mode));
    };

    // Reset the game
    const resetGame = () => {
        setGameState((prev) => ({
            ...prev,
            board: cloneBoard(prev.initialBoard),
            selectedCell: null,
            status: 'playing',
            secondsElapsed: 0,
        }));
    };

    // Begin new game
    const newGame = () => {
        setGameState((prev) => createInitialGame(prev.mode));
    };

    // Change and update the timer
    const tickTimer = () => {
        setGameState((prev) => {
            if (prev.status !== 'playing') return prev;

            return {
                ...prev,
                secondsElapsed: prev.secondsElapsed + 1,
            };
        });
    };

    // Game play and cell update rules
    const updateCell = (row, col, newValue) => {
        setGameState((prev) => {
            const currentCell = prev.board[row][col];

            // Fixed and end-game can not change
            if (currentCell.fixed || prev.status !== 'playing') {
                return prev;
            }

            const maxAllowed = prev.mode === 'easy' ? 6 : 9;

            // Allow clear the cell for input
            if (newValue === '') {
                const updatedBoard = prev.board.map((boardRow, rowIndex) =>
                    boardRow.map((cell, colIndex) => {
                        if (rowIndex === row && colIndex === col) {
                            return { ...cell, value: '', invalid: false };
                        }
                        return cell;
                    })
                );

                const validatedBoard = validateBoard(updatedBoard, prev.mode);
                const isWon = checkIfWon(validatedBoard, prev.solution);

                return {
                    ...prev,
                    board: validatedBoard,
                    status: isWon ? 'won' : 'playing',
                };
            }

            // Only allow one number and fixed range for different board and mode for input
            if (!/^[1-9]$/.test(newValue)) {
                return prev;
            }

            const numericValue = Number(newValue);

            if (numericValue < 1 || numericValue > maxAllowed) {
                return prev;
            }

            const updatedBoard = prev.board.map((boardRow, rowIndex) =>
                boardRow.map((cell, colIndex) => {
                    if (rowIndex === row && colIndex === col) {
                        return { ...cell, value: String(numericValue), invalid: false };
                    }
                    return cell;
                })
            );

            const validatedBoard = validateBoard(updatedBoard, prev.mode);
            const isWon = checkIfWon(validatedBoard, prev.solution);

            return {
                ...prev,
                board: validatedBoard,
                status: isWon ? 'won' : 'playing',
            };
        });
    };

    const value = useMemo(
        () => ({
            gameState,
            setGameState,
            selectCell,
            setMode,
            resetGame,
            newGame,
            tickTimer,
            updateCell,
        }),
        [gameState]
    );

    return (
        <SudokuContext.Provider value={value}>
            {children}
        </SudokuContext.Provider>
    );
}

// Check if game is win
function checkIfWon(board, solution) {
    for (let row = 0; row < board.length; row += 1) {
        for (let col = 0; col < board[row].length; col += 1) {
            const cell = board[row][col];

            if (cell.value === '') {
                return false;
            }

            if (cell.invalid) {
                return false;
            }

            if (String(solution[row][col]) !== String(cell.value)) {
                return false;
            }
        }
    }

    return true;
}

export function useSudoku() {
    const context = useContext(SudokuContext);

    if (!context) {
        throw new Error('useSudoku must be used inside SudokuProvider');
    }

    return context;
}