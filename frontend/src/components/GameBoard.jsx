import Cell from './Cell';
import '../styles/game-board.css';

function GameBoard({ board, size, selectedCell }) {
    const boardClassName =
        size === 6
            ? 'sudoku-board sudoku-board--6'
            : 'sudoku-board sudoku-board--9';

    return (
        <div className={boardClassName}>
            {board.map((row, rowIndex) =>
                row.map((cell, colIndex) => {
                    const isSelected =
                        selectedCell &&
                        selectedCell.row === rowIndex &&
                        selectedCell.col === colIndex;

                    return (
                        <Cell
                            key={`${rowIndex}-${colIndex}`}
                            cell={cell}
                            rowIndex={rowIndex}
                            colIndex={colIndex}
                            isSelected={isSelected}
                            size={size}
                        />
                    );
                })
            )}
        </div>
    );
}

export default GameBoard;