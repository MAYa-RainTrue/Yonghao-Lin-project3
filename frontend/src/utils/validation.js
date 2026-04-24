function cloneBoard(board) {
    return board.map((row) => row.map((cell) => ({ ...cell, invalid: false })));
}

function markDuplicates(cellsWithCoords, nextBoard) {
    // Mark the repeated value and cell as invalid
    const grouped = new Map();

    for (const item of cellsWithCoords) {
        const value = item.value;
        if (value === '') continue;

        if (!grouped.has(value)) {
            grouped.set(value, []);
        }

        grouped.get(value).push(item);
    }

    for (const entries of grouped.values()) {
        if (entries.length > 1) {
            for (const entry of entries) {
                nextBoard[entry.row][entry.col].invalid = true;
            }
        }
    }
}

function getSubgridCells(board, mode, startRow, startCol) {
    // Give one sub grid
    const cells = [];

    if (mode === 'easy') {
        // 6x6, 2 rows x 3 cols sub grid
        for (let row = startRow; row < startRow + 2; row += 1) {
            for (let col = startCol; col < startCol + 3; col += 1) {
                cells.push({
                    row,
                    col,
                    value: board[row][col].value,
                });
            }
        }
    } else {
        // 9x9, 3 rows x 3 cols sub grid
        for (let row = startRow; row < startRow + 3; row += 1) {
            for (let col = startCol; col < startCol + 3; col += 1) {
                cells.push({
                    row,
                    col,
                    value: board[row][col].value,
                });
            }
        }
    }

    return cells;
}

export function validateBoard(board, mode) {
    // For checking the board and the validation
    const nextBoard = cloneBoard(board);
    const size = board.length;

    // rows
    for (let row = 0; row < size; row += 1) {
        const rowCells = board[row].map((cell, col) => ({
            row,
            col,
            value: cell.value,
        }));
        markDuplicates(rowCells, nextBoard);
    }

    // cols
    for (let col = 0; col < size; col += 1) {
        const colCells = board.map((row, rowIndex) => ({
            row: rowIndex,
            col,
            value: row[col].value,
        }));
        markDuplicates(colCells, nextBoard);
    }

    // sub grids
    if (mode === 'easy') {
        for (let row = 0; row < size; row += 2) {
            for (let col = 0; col < size; col += 3) {
                const subgridCells = getSubgridCells(board, mode, row, col);
                markDuplicates(subgridCells, nextBoard);
            }
        }
    } else {
        for (let row = 0; row < size; row += 3) {
            for (let col = 0; col < size; col += 3) {
                const subgridCells = getSubgridCells(board, mode, row, col);
                markDuplicates(subgridCells, nextBoard);
            }
        }
    }

    return nextBoard;
}