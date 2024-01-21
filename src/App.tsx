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
  const INITIAL_CELLS = Array.from({ length: 9 }, () =>
    Array(9).fill(false),
  ) as boolean[][];
  const [cells, setCells] = useState(INITIAL_CELLS);

  const draggable = (
    <Draggable id="tile">
      <div className="h-10 w-10 bg-red-400" />
    </Draggable>
  );

  return (
    <DndContext
      onDragEnd={(event) => {
        if (!event.over) return cells;
        const [rowI, colI] = event.over.id.split(",").map(Number);
        setCells(cells.with(rowI, cells[rowI].with(colI, true)));
      }}
    >
      <Board cells={cells} />
      {draggable}
    </DndContext>
  );
}

type BoardProps = {
  cells: boolean[][];
};
function Board(props: BoardProps) {
  const isLightSquare = (rowI: number, colI: number) => {
    const isInOddRow = Math.floor(rowI / 3) % 2 === 1;
    const isInOddCol = Math.floor(colI / 3) % 2 === 1;
    return isInOddRow !== isInOddCol;
  };

  return (
    <div className="m-auto grid aspect-square max-w-xl grid-cols-9 grid-rows-9 gap-1 p-3">
      {props.cells.map((row, rowI) =>
        row.map((cell, colI) => (
          <Droppable id={`${rowI},${colI}`} key={colI}>
            <div
              className={cn(
                "h-full w-full rounded-md",
                isLightSquare(rowI, colI) ? "bg-gray-700" : "bg-gray-800",
                cell && "bg-red-400",
              )}
            />
          </Droppable>
        )),
      )}
    </div>
  );
}

type DraggableProps = {
  id: string;
  children: ReactNode;
};
function Draggable(props: DraggableProps) {
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

type DroppableProps = {
  id: string;
  children: ReactNode;
};
export function Droppable(props: DroppableProps) {
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
