import React, { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import styles from "./TaskCard.module.css";

function TaskCard({
	task,
	columnId,
	onMoveTask,
	onDeleteTask,
	onUpdateTitle,
	onUpdateComments,
	canMovePrev,
	canMoveNext,
	prevColumn,
	nextColumn,
}) {
	const [isEditing, setIsEditing] = useState(false);
	const [editTitle, setEditTitle] = useState(task.title);
	const [showComments, setShowComments] = useState(false);
	const [newComment, setNewComment] = useState("");

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

	const handleAddComment = (e) => {
		e.preventDefault();
		if (newComment.trim()) {
			const comment = {
				id: Date.now().toString(),
				text: newComment.trim(),
				date: new Date().toLocaleString(),
				author: "Пользователь",
			};

			const updatedComments = [...(task.comments || []), comment];

			if (onUpdateComments) {
				onUpdateComments(task.id, updatedComments);
			}

			setNewComment("");
		}
	};

	const handleDeleteComment = (commentId) => {
		const updatedComments = (task.comments || []).filter(
			(c) => c.id !== commentId,
		);

		if (onUpdateComments) {
			onUpdateComments(task.id, updatedComments);
		}
	};

	return (
		<div
			ref={setNodeRef}
			style={{
				...dragStyle,
				borderLeft: task.assignedTo
					? `4px solid ${task.assignedTo.color}`
					: "4px solid #e0e0e0",
			}}
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
					<h3
						onDoubleClick={handleDoubleClick}
						onClick={() => setShowComments(!showComments)}
						className={styles.taskTitle}
						style={{ cursor: "pointer" }}
					>
						{task.title}
						<span className={styles.commentIcon}>
							💬 {task.comments?.length || 0}
						</span>
					</h3>
				)}
				{task.description && (
					<p className={styles.taskDescription}>{task.description}</p>
				)}

				{task.assignedTo && (
					<div className={styles.assignedUser}>
						<div
							className={styles.userAvatar}
							style={{ backgroundColor: task.assignedTo.color }}
						>
							{task.assignedTo.initials}
						</div>
						<span className={styles.userName}>
							{task.assignedTo.name}
						</span>
					</div>
				)}

				{showComments && (
					<div className={styles.commentsSection}>
						<div className={styles.commentsHeader}>
							<span>
								💬 Комментарии ({task.comments?.length || 0})
							</span>
							<button
								className={styles.closeComments}
								onClick={() => setShowComments(false)}
							>
								✕
							</button>
						</div>

						<div className={styles.commentsList}>
							{task.comments && task.comments.length > 0 ? (
								task.comments.map((comment) => (
									<div
										key={comment.id}
										className={styles.comment}
									>
										<div className={styles.commentHeader}>
											<span
												className={styles.commentAuthor}
											>
												👤{" "}
												{comment.author ||
													"Пользователь"}
											</span>
											<span
												className={styles.commentDate}
											>
												📅 {comment.date}
											</span>
											<button
												onClick={() =>
													handleDeleteComment(
														comment.id,
													)
												}
												className={styles.deleteComment}
												title="Удалить комментарий"
											>
												✕
											</button>
										</div>
										<p className={styles.commentText}>
											{comment.text}
										</p>
									</div>
								))
							) : (
								<div className={styles.noComments}>
									💭 Нет комментариев. Напишите первый!
								</div>
							)}
						</div>

						<form
							onSubmit={handleAddComment}
							className={styles.commentForm}
						>
							<textarea
								value={newComment}
								onChange={(e) => setNewComment(e.target.value)}
								placeholder="Напишите комментарий..."
								rows="2"
								className={styles.commentInput}
							/>
							<button
								type="submit"
								className={styles.addCommentButton}
							>
								➕ Добавить комментарий
							</button>
						</form>
					</div>
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
