import React from "react";
import { useDroppable } from "@dnd-kit/core";
import TaskCard from "./TaskCard";
import styles from "./Column.module.css";

function Column({
	column,
	tasks,
	onMoveTask,
	onDeleteTask,
	onUpdateTaskTitle,
	getNextColumn,
	getPrevColumn,
}) {
	const nextColumn = getNextColumn(column.id);
	const prevColumn = getPrevColumn(column.id);

	const { setNodeRef, isOver } = useDroppable({
		id: column.id,
	});

	const currentCount = tasks.length;
	const maxLimit = column.wipLimit;
	const isLimitReached = maxLimit && currentCount >= maxLimit;

	return (
		<div
			ref={setNodeRef}
			className={`${styles.column} ${isOver ? styles.dropZoneActive : ""}`}
		>
			<div className={styles.columnHeader}>
				<h2>{column.title}</h2>
				<div className={styles.taskStats}>
					<span className={isLimitReached ? styles.limitReached : ""}>
						{currentCount}
					</span>
					{maxLimit && <span> / {maxLimit}</span>}
				</div>
			</div>

			{maxLimit && currentCount >= maxLimit && (
				<div className={styles.limitWarning}>⚠️ Лимит достигнут!</div>
			)}

			<div className={styles.taskList}>
				{tasks.length === 0 ? (
					<div className={styles.emptyMessage}>Нет задач</div>
				) : (
					tasks.map((task) => (
						<TaskCard
							key={task.id}
							task={task}
							columnId={column.id}
							onMoveTask={onMoveTask}
							onDeleteTask={onDeleteTask}
							onUpdateTitle={onUpdateTaskTitle}
							canMovePrev={!!prevColumn}
							canMoveNext={!!nextColumn}
							prevColumn={prevColumn}
							nextColumn={nextColumn}
						/>
					))
				)}
			</div>
		</div>
	);
}

export default Column;
