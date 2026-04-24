function cloneBoard(board) {
    return board.map((row) => [...row]);
}

// If the placement is valid
function isValidPlacement(board, row, col, value) {
    for (let c = 0; c < 9; c += 1) {
        if (board[row][c] === value) return false;
    }

    for (let r = 0; r < 9; r += 1) {
        if (board[r][col] === value) return false;
    }

    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;

    for (let r = startRow; r < startRow + 3; r += 1) {
        for (let c = startCol; c < startCol + 3; c += 1) {
            if (board[r][c] === value) return false;
        }
    }

    return true;
}

// Find th empty cell
function findEmptyCell(board) {
    for (let row = 0; row < 9; row += 1) {
        for (let col = 0; col < 9; col += 1) {
            if (board[row][col] === 0) {
                return { row, col };
            }
        }
    }

    return null;
}

function solveBoard(board) {
    const emptyCell = findEmptyCell(board);

    if (!emptyCell) {
        return true;
    }

    const { row, col } = emptyCell;

    for (let value = 1; value <= 9; value += 1) {
        if (isValidPlacement(board, row, col, value)) {
            board[row][col] = value;

            if (solveBoard(board)) {
                return true;
            }

            board[row][col] = 0;
        }
    }

    return false;
}

function countSolutions(board, limit = 2) {
    let count = 0;

    function backtrack() {
        if (count >= limit) return;

        const emptyCell = findEmptyCell(board);

        // Find one solution, return
        if (!emptyCell) {
            count += 1;
            return;
        }

        const { row, col } = emptyCell;

        // Iteration the possible value for the empty cell
        for (let value = 1; value <= 9; value += 1) {
            // If the value is valid
            if (isValidPlacement(board, row, col, value)) {
                board[row][col] = value;  // Add that value
                backtrack();  // Go recursive, if done with a solution, will count++ and give a return
                board[row][col] = 0; // Reset the temp value, try for another iteration
            }
        }
    }

    backtrack();
    return count;
}

export function validateCustomBoard(board) {
    if (!Array.isArray(board) || board.length !== 9) {
        return {
            valid: false,
            error: "Custom board must be a 9x9 board"
        };
    }

    for (const row of board) {
        if (!Array.isArray(row) || row.length !== 9) {
            return {
                valid: false,
                error: "Custom board must be a 9x9 board"
            };
        }

        for (const cell of row) {
            if (!Number.isInteger(cell) || cell < 0 || cell > 9) {
                return {
                    valid: false,
                    error: "Cells must contain numbers from 0 to 9"
                };
            }
        }
    }

    // Get the filled cell count #
    const filledCount = board.flat().filter((cell) => cell !== 0).length;

    // Empty condition
    if (filledCount === 0) {
        return {
            valid: false,
            error: "Custom board cannot be empty"
        };
    }

    const checkBoard = cloneBoard(board);

    // Check the conflict condition
    for (let row = 0; row < 9; row += 1) {
        for (let col = 0; col < 9; col += 1) {
            const value = checkBoard[row][col];

            if (value !== 0) {
                checkBoard[row][col] = 0;

                if (!isValidPlacement(checkBoard, row, col, value)) {
                    return {
                        valid: false,
                        error: "Custom board has conflicting values"
                    };
                }

                checkBoard[row][col] = value;
            }
        }
    }

    const solutionBoard = cloneBoard(board);
    const hasSolution = solveBoard(solutionBoard);

    if (!hasSolution) {
        return {
            valid: false,
            error: "Custom board has no solution"
        };
    }

    const solutionCount = countSolutions(cloneBoard(board), 2);

    if (solutionCount !== 1) {
        return {
            valid: false,
            error: "Custom board must have exactly one solution"
        };
    }

    return {
        valid: true,
        solution: solutionBoard
    };
}