import React, { useState } from "react";
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

	return (
		<div className={styles.taskCard}>
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
					<h3
						onDoubleClick={handleDoubleClick}
						className={styles.taskTitle}
					>
						{task.title}
					</h3>
				)}
				<p className={styles.taskDescription}>{task.description}</p>
			</div>

			<div className={styles.taskActions}>
				{canMovePrev && (
					<button
						onClick={() =>
							onMoveTask(task.id, columnId, prevColumn)
						}
						className={`${styles.moveButton} ${styles.prevButton}`}
						title="Переместить назад"
					>
						← Назад
					</button>
				)}
				{canMoveNext && (
					<button
						onClick={() =>
							onMoveTask(task.id, columnId, nextColumn)
						}
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
					X
				</button>
			</div>
		</div>
	);
}

export default TaskCard;
