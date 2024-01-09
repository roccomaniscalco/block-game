import { useState } from "react";

export default function App() {
  return (
    <div className="text-3xl text-white">
      <GameBoard />
    </div>
  );
}

function GameBoard() {
  const initialBoard = [
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

  const [board, setBoard] = useState(initialBoard);

  return (
    <div className="m-auto grid aspect-square max-w-lg grid-cols-9 grid-rows-9 gap-1 p-3">
      {board.map((row) =>
        row.map((cell, j) => (
          <div className="text-center" key={j}>
            {cell}
          </div>
        )),
      )}
    </div>
  );
}
