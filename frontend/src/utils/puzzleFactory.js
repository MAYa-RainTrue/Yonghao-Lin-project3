function createCell(value = '', fixed = false) {
    /*
    * Create cell
    * cell format as:
    *   value = "",
    *   fixed = false,
    *   invalid = false
    * */
    return {
        value: value === 0 ? '' : String(value),
        fixed,
        invalid: false,
    };
}

function clone2DArray(board) {
    // Change to 2D array
    return board.map((row) => [...row]);
}

function shuffle(array) {
    // Random location to create empty cells for input
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function createDigitMapping(size) {
    // Creating a number mapping to create random board
    const digits = Array.from({ length: size }, (_, index) => index + 1);
    const shuffledDigits = shuffle(digits);

    const mapping = new Map();

    for (let i = 0; i < digits.length; i += 1) {
        mapping.set(digits[i], shuffledDigits[i]);
    }

    return mapping;
}

function applyDigitMapping(solution, size) {
    // Apply the mapping to the solution
    const mapping = createDigitMapping(size);

    return solution.map((row) =>
        row.map((value) => mapping.get(value))
    );
}

/* Easy 6x6 solved boards */
const EASY_SOLUTIONS = [
    [
        [1, 2, 3, 4, 5, 6],
        [4, 5, 6, 1, 2, 3],
        [2, 3, 4, 5, 6, 1],
        [5, 6, 1, 2, 3, 4],
        [3, 4, 5, 6, 1, 2],
        [6, 1, 2, 3, 4, 5],
    ],
    [
        [6, 1, 2, 3, 4, 5],
        [3, 4, 5, 6, 1, 2],
        [5, 6, 1, 2, 3, 4],
        [2, 3, 4, 5, 6, 1],
        [4, 5, 6, 1, 2, 3],
        [1, 2, 3, 4, 5, 6],
    ],
];

/* Normal 9x9 solved boards */
const NORMAL_SOLUTIONS = [
    [
        [5, 3, 4, 6, 7, 8, 9, 1, 2],
        [6, 7, 2, 1, 9, 5, 3, 4, 8],
        [1, 9, 8, 3, 4, 2, 5, 6, 7],
        [8, 5, 9, 7, 6, 1, 4, 2, 3],
        [4, 2, 6, 8, 5, 3, 7, 9, 1],
        [7, 1, 3, 9, 2, 4, 8, 5, 6],
        [9, 6, 1, 5, 3, 7, 2, 8, 4],
        [2, 8, 7, 4, 1, 9, 6, 3, 5],
        [3, 4, 5, 2, 8, 6, 1, 7, 9],
    ],
    [
        [8, 2, 7, 1, 5, 4, 3, 9, 6],
        [9, 6, 5, 3, 2, 7, 1, 4, 8],
        [3, 4, 1, 6, 8, 9, 7, 5, 2],
        [5, 9, 3, 4, 6, 8, 2, 7, 1],
        [4, 7, 2, 5, 1, 3, 6, 8, 9],
        [6, 1, 8, 9, 7, 2, 4, 3, 5],
        [7, 8, 6, 2, 3, 5, 9, 1, 4],
        [1, 5, 4, 7, 9, 6, 8, 2, 3],
        [2, 3, 9, 8, 4, 1, 5, 6, 7],
    ],
];

function buildPuzzleFromSolution(solution, visibleCount) {
    // Based on the solution, give the board
    const size = solution.length;
    const totalCells = size * size;
    const hiddenCount = totalCells - visibleCount;

    const positions = [];
    for (let row = 0; row < size; row += 1) {
        for (let col = 0; col < size; col += 1) {
            positions.push([row, col]);
        }
    }

    const shuffledPositions = shuffle(positions);
    const hiddenSet = new Set(
        shuffledPositions
            .slice(0, hiddenCount)
            .map(([row, col]) => `${row}-${col}`)
    );

    const board = solution.map((row, rowIndex) =>
        row.map((value, colIndex) => {
            const key = `${rowIndex}-${colIndex}`;
            const shouldHide = hiddenSet.has(key);

            if (shouldHide) {
                return createCell('', false);
            }

            return createCell(value, true);
        })
    );

    return {
        solution: clone2DArray(solution),
        board,
    };
}

export function createEasyPuzzle() {
    const baseSolution =
        EASY_SOLUTIONS[Math.floor(Math.random() * EASY_SOLUTIONS.length)];

    // Apply random mapping
    const randomizedSolution = applyDigitMapping(baseSolution, 6);

    // 6*6 board, with half of the cells filled
    return buildPuzzleFromSolution(randomizedSolution, 18);
}

export function createNormalPuzzle() {
    const baseSolution =
        NORMAL_SOLUTIONS[Math.floor(Math.random() * NORMAL_SOLUTIONS.length)];

    // Apply random mapping
    const randomizedSolution = applyDigitMapping(baseSolution, 9);

    // 9*9 board, with 28-30 cells filled
    const visibleCount = 28 + Math.floor(Math.random() * 3);

    return buildPuzzleFromSolution(randomizedSolution, visibleCount);
}