import { CollisionDetection } from "@dnd-kit/core";
import { Coordinates } from "@dnd-kit/utilities";

function distanceBetween(p1: Coordinates, p2: Coordinates) {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

/**
 * Returns the closest rectangles from an array of rectangles to the corners of
 * another rectangle.
 */
export const closestOrigin: CollisionDetection = ({
  collisionRect,
  droppableRects,
  droppableContainers,
}) => {
  const collisionOrigin = { x: collisionRect.left, y: collisionRect.top };

  const closestDroppableRects = [...droppableRects].sort((a, b) => {
    const aDistance = distanceBetween(
      { x: a[1].left, y: a[1].top },
      collisionOrigin,
    );
    const bDistance = distanceBetween(
      { x: b[1].left, y: b[1].top },
      collisionOrigin,
    );
    return aDistance - bDistance;
  });

  return [
    {
      id: closestDroppableRects[0][0],
      data: droppableContainers.find(
        (container) => container.id === closestDroppableRects[0][0],
      )?.data,
    },
  ];
};
