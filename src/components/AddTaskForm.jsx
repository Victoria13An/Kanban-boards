import React, { useState } from "react";

function AddTaskForm({ onAdd }) {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		if (title.trim().length < 3) {
			alert("Название должно содержать минимум 3 символа");
			return;
		}
		onAdd(title.trim(), description.trim());
		setTitle("");
		setDescription("");
	};

	return (
		<form
			onSubmit={handleSubmit}
			style={{
				background: "white",
				padding: "1rem",
				borderRadius: "8px",
				marginBottom: "1rem",
				boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
			}}
		>
			<h3 style={{ margin: "0 0 1rem 0" }}>Добавить задачу</h3>
			<input
				type="text"
				placeholder="Название задачи"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				style={{
					width: "100%",
					padding: "8px",
					marginBottom: "8px",
					boxSizing: "border-box",
				}}
			/>
			<textarea
				placeholder="Описание"
				value={description}
				onChange={(e) => setDescription(e.target.value)}
				style={{
					width: "100%",
					padding: "8px",
					marginBottom: "8px",
					boxSizing: "border-box",
				}}
				rows="3"
			/>
			<button
				type="submit"
				style={{ padding: "8px 16px", cursor: "pointer" }}
			>
				Добавить
			</button>
		</form>
	);
}

export default AddTaskForm;
