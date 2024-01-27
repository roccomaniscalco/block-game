import { Collision, CollisionDetection } from "@dnd-kit/core";
import { RectMap } from "@dnd-kit/core/dist/store";
import { Coordinates } from "@dnd-kit/utilities";

function distanceBetween(p1: Coordinates, p2: Coordinates) {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

function getCollisionId(
  collisionOrigin: { x: number; y: number },
  droppableRects: RectMap,
) {
  return [...droppableRects].sort((a, b) => {
    const aDistance = distanceBetween(
      { x: a[1].left, y: a[1].top },
      collisionOrigin,
    );
    const bDistance = distanceBetween(
      { x: b[1].left, y: b[1].top },
      collisionOrigin,
    );
    return aDistance - bDistance;
  })[0][0];
}

function getShapeCellCount(shape: number[][]) {
  return shape.reduce(
    (acc, row) => acc + row.reduce((acc, cell) => acc + cell, 0),
    0,
  );
}

export const closestShape: CollisionDetection = ({
  active,
  collisionRect,
  droppableRects,
}) => {
  const collisionOrigin = { x: collisionRect.left, y: collisionRect.top };
  const collisionId = getCollisionId(collisionOrigin, droppableRects) as string;
  const collisionCoords = {
    x: parseInt(collisionId.split(",")[0]),
    y: parseInt(collisionId.split(",")[1]),
  };

  const collisions: Collision[] = [];

  (active.data.current as { shape: number[][] }).shape.forEach((row, y) => {
    row.forEach((tile, x) => {
      if (tile === 0) return;
      const droppableCoords = {
        x: collisionCoords.x + x,
        y: collisionCoords.y + y,
      };

      const droppableRect = droppableRects.get(
        droppableCoords.x + "," + droppableCoords.y,
      );

      if (!droppableRect) return;
      collisions.push({
        id: droppableCoords.x + "," + droppableCoords.y,
        data: droppableCoords,
      });
    });
  });

  return getShapeCellCount(active.data.current.shape) !== collisions.length
    ? []
    : collisions;
};
