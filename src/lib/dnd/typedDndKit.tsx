import {
  Active,
  DataRef,
  DndContextProps,
  DroppableContainer,
  Collision as OriginalCollision,
  CollisionDetection as OriginalCollisionDetection,
  DndContext as OriginalDndContext,
  Over,
  Translate,
  UseDraggableArguments,
  UseDroppableArguments,
  useDraggable as useOriginalDraggable,
  useDroppable as useOriginalDroppable,
} from "@dnd-kit/core";
import { Arguments } from "@dnd-kit/utilities";

type DroppableData = {
  x: number;
  y: number;
};
interface UseDroppableTypesafeArguments
  extends Omit<UseDroppableArguments, "data"> {
  data: DroppableData;
}
export function useDroppable(props: UseDroppableTypesafeArguments) {
  return useOriginalDroppable(props);
}

type DraggableData = {
  shape: number[][] | null;
};
interface UseDraggableTypesafeArguments
  extends Omit<UseDraggableArguments, "data"> {
  data: DraggableData;
}
export function useDraggable(props: UseDraggableTypesafeArguments) {
  return useOriginalDraggable(props);
}

interface TypesafeDroppableContainer extends Omit<DroppableContainer, "data"> {
  data: DataRef<DroppableData>;
}
type CollisionDetectionArguments = Arguments<OriginalCollisionDetection>[0];
interface CollisionDetectionTypesafeArguments
  extends Omit<CollisionDetectionArguments, "active" | "droppableContainers"> {
  active: TypesafeActive;
  droppableContainers: TypesafeDroppableContainer[];
}
export type CollisionDetection = (
  args: CollisionDetectionTypesafeArguments,
) => Collision[];

interface TypesafeActive extends Omit<Active, "data"> {
  data: DataRef<DraggableData>;
}
interface TypesafeOver extends Omit<Over, "data"> {
  data: DataRef<DroppableData>;
}
export interface Collision extends Omit<OriginalCollision, "data"> {
  data: DroppableData;
}
interface DragEvent {
  activatorEvent: Event;
  active: TypesafeActive;
  collisions: Collision[] | null;
  delta: Translate;
  over: TypesafeOver | null;
}
export interface DragStartEvent extends Pick<DragEvent, "active"> {}
export interface DragMoveEvent extends DragEvent {}
export interface DragOverEvent extends DragMoveEvent {}
export interface DragEndEvent extends DragEvent {}
export interface DragCancelEvent extends DragEndEvent {}
export interface DndContextTypesafeProps
  extends Omit<
    DndContextProps,
    "onDragStart" | "onDragMove" | "onDragOver" | "onDragEnd" | "onDragCancel" | "collisionDetection"
  > {
  onDragStart?(event: DragStartEvent): void;
  onDragMove?(event: DragMoveEvent): void;
  onDragOver?(event: DragOverEvent): void;
  onDragEnd?(event: DragEndEvent): void;
  onDragCancel?(event: DragCancelEvent): void;
  collisionDetection?: CollisionDetection;
}
const TypesafeDndContext = OriginalDndContext as React.NamedExoticComponent<DndContextTypesafeProps>
export function DndContext(props: DndContextTypesafeProps) {
  return <TypesafeDndContext {...props} />;
}
