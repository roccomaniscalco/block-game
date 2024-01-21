import { useState } from "react";

export default function App() {
  return (
    <div className="text-3xl text-white">
      <GameBoard />
    </div>
  );
}

function isLightSquare(rowI: number, colI: number) {
  const isInOddRow = Math.floor(rowI / 3) % 2 === 1;
  const isInOddCol = Math.floor(colI / 3) % 2 === 1;
  return isInOddRow !== isInOddCol;
}

const INITIAL_BOARD = [
  [".", ".", ".", ".", ".", ".", ".", ".", "."],
  [".", ".", ".", ".", ".", ".", ".", ".", "."],
  [".", ".", ".", ".", ".", ".", ".", ".", "."],
  [".", ".", ".", ".", ".", ".", ".", ".", "."],
  [".", ".", ".", ".", ".", ".", ".", ".", "."],
  [".", ".", ".", ".", ".", ".", ".", ".", "."],
  [".", ".", ".", ".", ".", ".", ".", ".", "."],
  [".", ".", ".", ".", ".", ".", ".", ".", "."],
  [".", ".", ".", ".", ".", ".", ".", ".", "."],
];

function GameBoard() {
  const [board, setBoard] = useState(INITIAL_BOARD);

  return (
    <div className="m-auto grid aspect-square max-w-lg grid-cols-9 grid-rows-9 gap-1 p-3">
      {board.map((row, rowI) =>
        row.map((cell, colI) => (
          <div
            className={isLightSquare(rowI, colI) ? "text-red-500" : "text-blue-500"}
            key={colI}
          >
            {cell}
          </div>
        )),
      )}
    </div>
  );
}
