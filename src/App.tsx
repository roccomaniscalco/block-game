import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { cn } from "./utils";
import SHAPES from "./shapes.json";

type ShapeName = keyof typeof SHAPES;

export default function App() {
  return <Game />;
}

function Game() {
  const INITIAL_TILES = Array.from({ length: 9 }, () =>
    Array(9).fill(false),
  ) as boolean[][];

  const getRandomShape = () => {
    const shapes = Object.keys(SHAPES) as ShapeName[];
    const randomShapeName = shapes[Math.floor(Math.random() * shapes.length)];
    return SHAPES[randomShapeName];
  };

  const initialShape = [...Array(3).keys()].map(getRandomShape);

  const [tiles, setTiles] = useState(INITIAL_TILES);
  const [shapes, setShapes] = useState(initialShape);

  return (
    <DndContext
      onDragEnd={(event) => {
        if (!event.over || !event.active) return tiles;
        const { x, y } = event.over.data.current as { x: number; y: number };
        if (tiles[y][x]) return tiles;
        setTiles(tiles.with(y, tiles[y].with(x, true)));
        setShapes(shapes.toSpliced(event.active.id.split("-")[1], 1));
      }}
    >
      <main className="flex h-full flex-col gap-10 p-5">
        <Board tiles={tiles} />
        <ShapePalette shapes={shapes} />
      </main>
    </DndContext>
  );
}

type BoardProps = {
  tiles: boolean[][];
};
function Board(props: BoardProps) {
  return (
    <div className="min-h-0">
      <div className="mx-auto grid aspect-square max-h-full max-w-xl grid-cols-9 grid-rows-9 gap-1">
        {props.tiles.map((row, y) =>
          row.map((tile, x) => <Tile x={x} y={y} key={x} isFilled={tile} />),
        )}
      </div>
    </div>
  );
}

type ShapePaletteProps = {
  shapes: number[][][];
};
function ShapePalette(props: ShapePaletteProps) {
  return (
    <div className="mx-auto flex w-full max-w-xl items-center justify-evenly gap-5">
      {props.shapes.map((shape, idx) => (
        <div className="flex flex-1 justify-center">
          <Shape key={idx} id={`shape-${idx}`} shape={shape} />
        </div>
      ))}
    </div>
  );
}

type ShapeProps = {
  id: string;
  shape: number[][];
};
function Shape(props: ShapeProps) {
  const { attributes, listeners, setNodeRef, transform } =
    useDraggable({
      id: props.id,
    });

  return (
    <button
      className={cn("grid gap-1")}
      style={{
        transform: CSS.Translate.toString(transform),
        gridTemplateRows: `repeat(${props.shape.length}, 1fr)`,
        gridTemplateColumns: `repeat(${props.shape[0].length}, 1fr)`,
      }}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
    >
      {props.shape.map((row) =>
        row.map((isFilled, x) => (
          <div
            className={cn(
              "h-7 w-7 rounded-md",
              isFilled ? "bg-red-400" : "bg-gray",
            )}
            key={x}
          />
        )),
      )}
    </button>
  );
}

type TileProps = {
  x: number;
  y: number;
  isFilled: boolean;
};
export function Tile(props: TileProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: `${props.x},${props.y}`,
    data: { x: props.x, y: props.y },
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
        isOver && !props.isFilled && "brightness-150",
      )}
    />
  );
}
