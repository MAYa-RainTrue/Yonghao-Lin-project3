import { useSudoku } from '../context/SudokuContext';

function Cell({
                  cell,
                  rowIndex,
                  colIndex,
                  isSelected,
                  size,
              }) {
    const { selectCell, updateCell } = useSudoku();

    let className = 'sudoku-cell';

    if (cell.fixed) {
        className += ' sudoku-cell--fixed';
    }

    if (cell.invalid) {
        className += ' sudoku-cell--invalid';
    }

    if (isSelected) {
        className += ' sudoku-cell--selected';
    }

    // sub grid borders, for clear finding the sub grid in game
    if (size === 6) {
        if ((colIndex + 1) % 3 === 0 && colIndex !== size - 1) {
            className += ' sudoku-cell--subgrid-right';
        }
        if ((rowIndex + 1) % 2 === 0 && rowIndex !== size - 1) {
            className += ' sudoku-cell--subgrid-bottom';
        }
    }

    if (size === 9) {
        if ((colIndex + 1) % 3 === 0 && colIndex !== size - 1) {
            className += ' sudoku-cell--subgrid-right';
        }
        if ((rowIndex + 1) % 3 === 0 && rowIndex !== size - 1) {
            className += ' sudoku-cell--subgrid-bottom';
        }
    }

    return (
        <input
            className={className}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={cell.value}
            readOnly={cell.fixed}
            onClick={() => selectCell(rowIndex, colIndex)}
            onFocus={() => selectCell(rowIndex, colIndex)}
            onChange={(event) => updateCell(rowIndex, colIndex, event.target.value)}
        />
    );
}

export default Cell;