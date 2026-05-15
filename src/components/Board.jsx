import React from "react";
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
	const getNextColumn = (currentColumnId) => {
		const currentIndex = columns.findIndex(
			(col) => col.id === currentColumnId,
		);
		if (currentIndex < columns.length - 1) {
			return columns[currentIndex + 1].id;
		}
		return null;
	};

	const getPrevColumn = (currentColumnId) => {
		const currentIndex = columns.findIndex(
			(col) => col.id === currentColumnId,
		);
		if (currentIndex > 0) {
			return columns[currentIndex - 1].id;
		}
		return null;
	};

	return (
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
	);
}

export default Board;
