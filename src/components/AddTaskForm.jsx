import React, { useState } from "react";

function AddTaskForm({ onAdd, users }) {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [assignedUser, setAssignedUser] = useState(null);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (title.trim().length < 3) {
			alert("Название должно содержать минимум 3 символа");
			return;
		}
		onAdd(title.trim(), description.trim(), assignedUser);
		setTitle("");
		setDescription("");
		setAssignedUser(null);
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
					border: "1px solid #ddd",
					borderRadius: "4px",
				}}
			/>

			<textarea
				placeholder="Описание"
				value={description}
				onChange={(e) => setDescription(e.target.value)}
				style={{
					width: "100%",
					padding: "8px",
					marginBottom: "12px",
					boxSizing: "border-box",
					border: "1px solid #ddd",
					borderRadius: "4px",
				}}
				rows="3"
			/>

			{/* Выбор исполнителя с аватарками */}
			<div style={{ marginBottom: "12px" }}>
				<label
					style={{
						display: "block",
						marginBottom: "8px",
						fontSize: "14px",
						fontWeight: "500",
						color: "#555",
					}}
				>
					Назначить исполнителя:
				</label>
				<div
					style={{
						display: "flex",
						gap: "12px",
						flexWrap: "wrap",
					}}
				>
					{users?.map((user) => (
						<div
							key={user.id}
							onClick={() => setAssignedUser(user)}
							style={{
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								gap: "6px",
								padding: "8px",
								borderRadius: "8px",
								background:
									assignedUser?.id === user.id
										? user.color + "20"
										: "#f5f5f5",
								border:
									assignedUser?.id === user.id
										? `2px solid ${user.color}`
										: "2px solid transparent",
								cursor: "pointer",
								transition: "all 0.2s",
								minWidth: "70px",
							}}
						>
							<div
								style={{
									width: "40px",
									height: "40px",
									borderRadius: "50%",
									background: user.color,
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									color: "white",
									fontWeight: "bold",
									fontSize: "16px",
								}}
							>
								{user.initials}
							</div>
							<span
								style={{ fontSize: "12px", fontWeight: "500" }}
							>
								{user.name}
							</span>
						</div>
					))}
				</div>
			</div>

			<button
				type="submit"
				style={{
					padding: "8px 16px",
					cursor: "pointer",
					background: "#4a90e2",
					color: "white",
					border: "none",
					borderRadius: "4px",
					fontWeight: "500",
				}}
			>
				Добавить задачу
			</button>
		</form>
	);
}

export default AddTaskForm;
