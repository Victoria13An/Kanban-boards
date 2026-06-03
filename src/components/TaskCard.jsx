import React, { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import styles from "./TaskCard.module.css";

function TaskCard({
  task,
  columnId,
  onMoveTask,
  onDeleteTask,
  onUpdateTitle,
  canMovePrev,
  canMoveNext,
  prevColumn,
  nextColumn,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
      data: {
        ...task,
        sourceColumnId: columnId,
      },
    });

  const dragStyle = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 1000,
      }
    : undefined;

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleSaveTitle = () => {
    if (editTitle.trim() && editTitle.length >= 3) {
      onUpdateTitle(task.id, columnId, editTitle.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSaveTitle();
    }
    if (e.key === "Escape") {
      setEditTitle(task.title);
      setIsEditing(false);
    }
  };

  const handleMoveLeft = () => {
    if (prevColumn) {
      onMoveTask(task.id, columnId, prevColumn);
    }
  };

  const handleMoveRight = () => {
    if (nextColumn) {
      onMoveTask(task.id, columnId, nextColumn);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={dragStyle}
      {...attributes}
      {...listeners}
      className={`${styles.taskCard} ${isDragging ? styles.dragging : ""}`}
    >
      <div className={styles.dragHandle} title="Перетащить мышкой">
        ⋮⋮
      </div>

      <div className={styles.taskContent}>
        {isEditing ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleSaveTitle}
            onKeyDown={handleKeyDown}
            className={styles.editInput}
            autoFocus
          />
        ) : (
          <h3 onDoubleClick={handleDoubleClick} className={styles.taskTitle}>
            {task.title}
          </h3>
        )}
        {task.description && (
          <p className={styles.taskDescription}>{task.description}</p>
        )}
      </div>

      <div className={styles.taskActions}>
        {canMovePrev && (
          <button
            onClick={handleMoveLeft}
            className={`${styles.moveButton} ${styles.prevButton}`}
            title="Переместить назад"
          >
            ← Назад
          </button>
        )}
        {canMoveNext && (
          <button
            onClick={handleMoveRight}
            className={`${styles.moveButton} ${styles.nextButton}`}
            title="Переместить вперед"
          >
            Вперед →
          </button>
        )}
        <button
          onClick={() => onDeleteTask(task.id, columnId)}
          className={styles.deleteButton}
          title="Удалить задачу"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default TaskCard;
