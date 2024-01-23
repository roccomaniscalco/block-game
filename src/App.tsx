import {
  DndContext,
  closestCenter,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { CSS, useCombinedRefs } from "@dnd-kit/utilities";
import { memo, useCallback, useState } from "react";
import { snapBottomToCursor } from "./lib/dnd/snapBottomToCursor";
import SHAPES from "./shapes.json";
import { array, cn, getObjectKeys } from "./utils";

export default function App() {
  return <Game />;
}

function Game() {
  const INITIAL_TILES = array(9, array(9, false));

  const getRandomShape = () => {
    const shapes = getObjectKeys(SHAPES);
    const randomShapeName = shapes[Math.floor(Math.random() * shapes.length)];
    return SHAPES[randomShapeName];
  };

  const initialShapes = {
    1: getRandomShape(),
    2: getRandomShape(),
    3: getRandomShape(),
  };

  const [tiles, setTiles] = useState(INITIAL_TILES);
  const [shapes, setShapes] = useState(initialShapes);

  return (
    <DndContext
      modifiers={[restrictToWindowEdges, snapBottomToCursor]}
      collisionDetection={closestCenter}
      onDragEnd={(event) => {
        if (!event.over || !event.active) return tiles;
        const { x, y } = event.over.data.current as { x: number; y: number };
        if (tiles[y][x]) return tiles;
        setTiles(tiles.with(y, tiles[y].with(x, true)));
        setShapes({ ...shapes, [event.active.id]: null });
      }}
    >
      <main className="flex h-full flex-col gap-5 p-5">
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
    <div className="mx-auto flex h-32 min-h-32 w-full max-w-xl rounded-md border border-gray-700 ">
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
  });
  const { setNodeRef: setDroppableNodeRef } = useDroppable({ id: props.id });

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
      id={`${props.x},${props.y}`}
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
