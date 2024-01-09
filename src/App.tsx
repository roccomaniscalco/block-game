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
    <div className="grid aspect-square grid-cols-9 grid-rows-9 gap-1">
      {board.map((row) => row.map((cell, j) => <div key={j}>{cell}</div>))}
    </div>
  );
}
