import {
  DragDropContext,
  Droppable,
  Draggable,
  OnDragEndResponder,
} from "@hello-pangea/dnd";
import clsx from "clsx";

export const DragAndDrop: React.FC<{
  onDragEnd: OnDragEndResponder;
  data: { jsx: React.ReactNode; key: string }[];
}> = ({ onDragEnd, data }) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="..." direction="vertical">
        {(droppable) => (
          <div {...droppable.droppableProps} ref={droppable.innerRef}>
            {data.map(({ key, jsx }, index) => {
              return (
                <Draggable key={key} index={index} draggableId={key}>
                  {(draggable, snapshot) => (
                    <div
                      className={clsx(snapshot.isDragging && "is-dragging")}
                      {...draggable.draggableProps}
                      {...draggable.dragHandleProps}
                      ref={draggable.innerRef}
                    >
                      {jsx}
                    </div>
                  )}
                </Draggable>
              );
            })}
            {droppable.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
