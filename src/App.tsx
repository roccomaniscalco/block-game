import { useDndContext } from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { CSS, useCombinedRefs } from "@dnd-kit/utilities";
import { useState } from "react";
import { closestShape } from "./lib/dnd/closestShape";
import { snapBottomToCursor } from "./lib/dnd/snapBottomToCursor";
import SHAPES from "./shapes.json";
import { cn, getObjectKeys, rotateMatrix } from "./utils";
import { nanoid } from "nanoid";
import { DndContext, useDroppable, useDraggable } from "./lib/dnd/typedDndKit";

export default function App() {
  return <Game />;
}

function evaluateBoard(tiles: boolean[][]) {
  let completions = 0;

  tiles.forEach((row) => {
    if (row.every((tile) => tile)) {
      completions++;
      tiles.splice(tiles.indexOf(row), 1, Array(9).fill(false));
    }
  });

  tiles[0].forEach((_, x) => {
    if (tiles.every((row) => row[x])) {
      completions++;
      tiles.forEach((row) => row.splice(x, 1, false));
    }
  });

  for (let y = 0; y < tiles.length; y += 3) {
    for (let x = 0; x < tiles[0].length; x += 3) {
      const square = tiles.slice(y, y + 3).map((row) => row.slice(x, x + 3));
      if (square.every((row) => row.every((tile) => tile))) {
        completions++;
        square.forEach((row, y2) => {
          row.forEach((_, x2) => {
            tiles[y2 + y][x2 + x] = false;
          });
        });
      }
    }
  }

  return { tiles, completions };
}

function Game() {
  const INITIAL_TILES = Array.from({ length: 9 }).map(() =>
    new Array(9).fill(false),
  ) as boolean[][];

  const getRandomShape = () => {
    const shapes = getObjectKeys(SHAPES);
    const randomShapeName = shapes[Math.floor(Math.random() * shapes.length)];
    let rotatedShape = SHAPES[randomShapeName];
    while (Math.floor(Math.random() * 4)) {
      rotatedShape = rotateMatrix(rotatedShape);
    }
    return rotatedShape;
  };

  const getRandomShapes = () => {
    return Array.from({ length: 3 }).reduce<Record<string, number[][] | null>>(
      (acc) => {
        const shape = getRandomShape();
        acc[nanoid()] = shape;
        return acc;
      },
      {},
    );
  };

  const [tiles, setTiles] = useState(INITIAL_TILES);
  const [shapes, setShapes] =
    useState<Record<string, number[][] | null>>(getRandomShapes());

  return (
    <DndContext
      modifiers={[restrictToWindowEdges, snapBottomToCursor]}
      collisionDetection={closestShape}
      onDragEnd={(event) => {
        if (!event.collisions || !event.active) return tiles;
        if (event.collisions.some((c) => !!tiles[c.data.y][c.data.x]))
          return tiles;

        const tilesCopy = structuredClone(tiles);
        event.collisions.forEach((c) => {
          tilesCopy[c.data.y][c.data.x] = true;
        });
        const { tiles: evaluatedTiles } = evaluateBoard(tilesCopy);
        setTiles(evaluatedTiles);

        if (Object.values(shapes).filter(Boolean).length === 1) {
          setShapes(getRandomShapes());
        } else {
          setShapes({ ...shapes, [event.active.id]: null });
        }
      }}
    >
      <main className="flex h-full flex-col justify-end gap-5 p-5">
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
          row.map((tile, x) => (
            <Tile x={x} y={y} key={`${x},${y}`} isFilled={tile} />
          )),
        )}
      </div>
    </div>
  );
}

type ShapePaletteProps = {
  shapes: Record<string, number[][] | null>;
};
function ShapePalette(props: ShapePaletteProps) {
  return (
    <div className="mx-auto flex h-40 min-h-40 w-full max-w-xl rounded-md border border-gray-700 ">
      {Object.entries(props.shapes).map(([key, value]) => (
        <Shape id={key} shape={value} key={key} />
      ))}
    </div>
  );
}

type ShapeProps = {
  id: string;
  shape: number[][] | null;
};
function Shape(props: ShapeProps) {
  const {
    attributes,
    listeners,
    setNodeRef: setDraggableNodeRef,
    setActivatorNodeRef: setDraggableActivatorNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: props.id,
    data: { shape: props.shape },
  });

  const { setNodeRef: setDroppableNodeRef } = useDroppable({
    id: props.id,
  });

  const getTileRect = () =>
    document.getElementById("0,0")?.getClientRects()[0] ?? {
      width: 0,
      height: 0,
    };

  const droppableRef = useCombinedRefs(
    setDroppableNodeRef,
    setDraggableActivatorNodeRef,
  );

  return (
    <div
      ref={droppableRef}
      {...listeners}
      className="flex h-full w-0 flex-1 cursor-pointer items-center justify-center"
    >
      {!props.shape ? (
        <div className="flex" />
      ) : (
        <button
          className="grid gap-1 transition-all duration-75"
          style={{
            transform: CSS.Translate.toString(transform),
            gridTemplateRows: `repeat(${props.shape.length}, 1fr)`,
            gridTemplateColumns: `repeat(${props.shape[0].length}, 1fr)`,
            ...(isDragging
              ? {
                  width:
                    getTileRect().width * props.shape[0].length +
                    (props.shape[0].length - 1) * 4,
                  height:
                    getTileRect().height * props.shape.length +
                    (props.shape.length - 1) * 4,
                }
              : {}),
          }}
          ref={setDraggableNodeRef}
          {...listeners}
          {...attributes}
        >
          {props.shape.map((row) =>
            row.map((isFilled, x) => (
              <div
                className={cn(
                  "h-5 w-5",
                  isFilled && "bg-red-400 shadow-lg",
                  isDragging ? "rounded-lg" : "rounded-sm",
                )}
                key={x}
                style={
                  isDragging
                    ? {
                        width: getTileRect().width,
                        height: getTileRect().height,
                      }
                    : {}
                }
              />
            )),
          )}
        </button>
      )}
    </div>
  );
}

type TileProps = {
  x: number;
  y: number;
  isFilled: boolean;
};
export function Tile(props: TileProps) {
  const droppableId = `${props.x},${props.y}`;
  const { collisions } = useDndContext();
  const { setNodeRef } = useDroppable({
    id: droppableId,
    data: { x: props.x, y: props.y },
  });

  const isLightSquare = (y: number, x: number) => {
    const isInOddRow = Math.floor(y / 3) % 2 === 1;
    const isInOddCol = Math.floor(x / 3) % 2 === 1;
    return isInOddRow !== isInOddCol;
  };

  return (
    <div
      id={droppableId}
      ref={setNodeRef}
      className={cn(
        "h-full w-full rounded-md",
        isLightSquare(props.y, props.x) ? "bg-gray-700" : "bg-gray-800",
        props.isFilled && "bg-red-400",
        !props.isFilled &&
          collisions?.some(({ id }) => id === droppableId) &&
          "brightness-150",
      )}
    />
  );
}
