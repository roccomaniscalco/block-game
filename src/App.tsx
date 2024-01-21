import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { ReactNode, useState } from "react";
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

  const piece = (
    <Piece id="tile">
      <div className="h-10 w-10 bg-red-400" />
    </Piece>
  );

  return (
    <DndContext
      onDragEnd={(event) => {
        if (!event.over) return tiles;
        const [y, x] = event.over.id.split(",").map(Number);
        setTiles(tiles.with(y, tiles[y].with(x, true)));
      }}
    >
      <Board tiles={tiles} />
      {piece}
    </DndContext>
  );
}

type BoardProps = {
  tiles: boolean[][];
};
function Board(props: BoardProps) {
  const isLightSquare = (y: number, x: number) => {
    const isInOddRow = Math.floor(y / 3) % 2 === 1;
    const isInOddCol = Math.floor(x / 3) % 2 === 1;
    return isInOddRow !== isInOddCol;
  };

  return (
    <div className="m-auto grid aspect-square max-w-xl grid-cols-9 grid-rows-9 gap-1 p-3">
      {props.tiles.map((row, y) =>
        row.map((tile, x) => (
          <Tile id={`${y},${x}`} key={x}>
            <div
              className={cn(
                "h-full w-full rounded-md",
                isLightSquare(y, x) ? "bg-gray-700" : "bg-gray-800",
                tile && "bg-red-400",
              )}
            />
          </Tile>
        )),
      )}
    </div>
  );
}

type PieceProps = {
  id: string;
  children: ReactNode;
};
function Piece(props: PieceProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: props.id,
  });
  const style = {
    // Outputs `translate3d(x, y, 0)`
    transform: CSS.Translate.toString(transform),
  };

  return (
    <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {props.children}
    </button>
  );
}

type TileProps = {
  id: string;
  children: ReactNode;
};
export function Tile(props: TileProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
  });
  const style = {
    opacity: isOver ? 1 : 0.8,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {props.children}
    </div>
  );
}
