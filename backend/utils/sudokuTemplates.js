function cloneBoard(board) {
    return board.map((row) => [...row]);
}

function shuffleArray(array) {
    const result = [...array];

    for (let i = result.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
}

function createNumberMap(size) {
    const numbers = Array.from({ length: size }, (_, index) => index + 1);
    const shuffled = shuffleArray(numbers);
    const numberMap = new Map();

    numbers.forEach((number, index) => {
        numberMap.set(number, shuffled[index]);
    });

    return numberMap;
}

function remapNumbers(board, numberMap) {
    return board.map((row) =>
        row.map((cell) => (cell === 0 ? 0 : numberMap.get(cell)))
    );
}

function shuffleRowsWithinBands(board, bandSize) {
    const result = [];

    for (let start = 0; start < board.length; start += bandSize) {
        const band = board.slice(start, start + bandSize);
        result.push(...shuffleArray(band));
    }

    return result;
}

function shuffleBands(board, bandSize) {
    const bands = [];

    for (let start = 0; start < board.length; start += bandSize) {
        bands.push(board.slice(start, start + bandSize));
    }

    return shuffleArray(bands).flat();
}

function transpose(board) {
    return board[0].map((_, colIndex) => board.map((row) => row[colIndex]));
}

function randomizeSolution(solution, bandSize) {
    let result = cloneBoard(solution);

    result = shuffleRowsWithinBands(result, bandSize);
    result = shuffleBands(result, bandSize);

    result = transpose(result);
    result = shuffleRowsWithinBands(result, bandSize);
    result = shuffleBands(result, bandSize);
    result = transpose(result);

    result = remapNumbers(result, createNumberMap(solution.length));

    return result;
}

function removeCells(solution, cellsToRemove) {
    const board = cloneBoard(solution);
    const positions = [];

    for (let row = 0; row < solution.length; row += 1) {
        for (let col = 0; col < solution.length; col += 1) {
            positions.push({ row, col });
        }
    }

    const shuffledPositions = shuffleArray(positions);

    for (let i = 0; i < cellsToRemove; i += 1) {
        const { row, col } = shuffledPositions[i];
        board[row][col] = 0;
    }

    return board;
}

const easyBaseSolution = [
    [1, 2, 3, 4, 5, 6],
    [4, 5, 6, 1, 2, 3],
    [2, 3, 4, 5, 6, 1],
    [5, 6, 1, 2, 3, 4],
    [3, 4, 5, 6, 1, 2],
    [6, 1, 2, 3, 4, 5]
];

const normalBaseSolution = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9]
];

export function getTemplateByDifficulty(difficulty) {
    if (difficulty === "EASY") {
        const solution = randomizeSolution(easyBaseSolution, 2);
        const board = removeCells(solution, 18);

        return {
            board,
            solution
        };
    }

    const solution = randomizeSolution(normalBaseSolution, 3);
    const board = removeCells(solution, 51);

    return {
        board,
        solution
    };
}