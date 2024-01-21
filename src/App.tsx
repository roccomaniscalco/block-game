import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useId, useState } from "react";
import { cn } from "./utils";

export default function App() {
  return (
    <div className="text-3xl text-white">
      <Game />
    </div>
  );
}

function Game() {
  const INITIAL_TILES = Array.from({ length: 9 }, () =>
    Array(9).fill(false),
  ) as boolean[][];
  const [tiles, setTiles] = useState(INITIAL_TILES);

  return (
    <DndContext
      onDragEnd={(event) => {
        if (!event.over) return tiles;
        const [y, x] = event.over.id.split(",").map(Number);
        setTiles(tiles.with(y, tiles[y].with(x, true)));
      }}
    >
      <Board tiles={tiles} />
      <Piece />
    </DndContext>
  );
}

type BoardProps = {
  tiles: boolean[][];
};
function Board(props: BoardProps) {
  return (
    <div className="m-auto grid aspect-square max-w-xl grid-cols-9 grid-rows-9 gap-1 p-3">
      {props.tiles.map((row, y) =>
        row.map((tile, x) => <Tile x={x} y={y} key={x} isFilled={tile} />),
      )}
    </div>
  );
}

function Piece() {
  const id = useId();
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });

  return (
    <button
      className="h-10 w-10 bg-red-400"
      style={{ transform: CSS.Translate.toString(transform) }}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
    ></button>
  );
}

type TileProps = {
  x: number;
  y: number;
  isFilled: boolean;
};
export function Tile(props: TileProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: `${props.y},${props.x}`,
  });

  const isLightSquare = (y: number, x: number) => {
    const isInOddRow = Math.floor(y / 3) % 2 === 1;
    const isInOddCol = Math.floor(x / 3) % 2 === 1;
    return isInOddRow !== isInOddCol;
  };

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "h-full w-full rounded-md",
        isLightSquare(props.y, props.x) ? "bg-gray-700" : "bg-gray-800",
        props.isFilled && "bg-red-400",
        isOver && "brightness-150",
      )}
    />
  );
}
