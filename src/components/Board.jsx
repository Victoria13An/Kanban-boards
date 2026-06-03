import React, { useState } from "react";
import { DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import Column from "./Column";
import styles from "./Board.module.css";

function Board({
  columns,
  tasks,
  getFilteredTasks,
  onMoveTask,
  onDeleteTask,
  onUpdateTaskTitle,
}) {
  const [activeTask, setActiveTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const getNextColumn = (currentColumnId) => {
    const currentIndex = columns.findIndex(
      (col) => col.id === currentColumnId
    );
    if (currentIndex < columns.length - 1) {
      return columns[currentIndex + 1].id;
    }
    return null;
  };

  const getPrevColumn = (currentColumnId) => {
    const currentIndex = columns.findIndex(
      (col) => col.id === currentColumnId
    );
    if (currentIndex > 0) {
      return columns[currentIndex - 1].id;
    }
    return null;
  };

  const handleDragStart = (event) => {
    const { active } = event;
    const taskId = active.id;

    let draggedTask = null;
    for (const column of columns) {
      const task = getFilteredTasks(column.id).find((t) => t.id === taskId);
      if (task) {
        draggedTask = { ...task, columnId: column.id };
        break;
      }
    }
    setActiveTask(draggedTask);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id;
    const targetColumnId = over.id;

    let sourceColumnId = null;
    for (const column of columns) {
      const taskExists = getFilteredTasks(column.id).some(
        (t) => t.id === taskId
      );
      if (taskExists) {
        sourceColumnId = column.id;
        break;
      }
    }

    if (sourceColumnId && sourceColumnId !== targetColumnId) {
      onMoveTask(taskId, sourceColumnId, targetColumnId);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className={styles.board}>
        {columns.map((column) => (
          <Column
            key={column.id}
            column={column}
            tasks={getFilteredTasks(column.id)}
            onMoveTask={onMoveTask}
            onDeleteTask={onDeleteTask}
            onUpdateTaskTitle={onUpdateTaskTitle}
            getNextColumn={getNextColumn}
            getPrevColumn={getPrevColumn}
          />
        ))}
      </div>
      <DragOverlay>
        {activeTask ? (
          <div className={styles.dragOverlay}>
            <h4>{activeTask.title}</h4>
            {activeTask.description && <p>{activeTask.description}</p>}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default Board;