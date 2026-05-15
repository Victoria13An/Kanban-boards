import React, { useState, useEffect } from "react";
import Board from "./components/Board";
import AddTaskForm from "./components/AddTaskForm";

const INITIAL_COLUMNS = [
	{ id: "backlog", title: "Backlog (Новые задачи)", order: 0 },
	{ id: "ready", title: "Ready (Готовы к выполнению)", order: 1 },
	{ id: "inProgress", title: "In Progress (В работе)", order: 2 },
	{ id: "finished", title: "Finished (Завершены)", order: 3 },
];

const INITIAL_TASKS = {
	backlog: [
		{
			id: "1",
			title: "Изучить React",
			description: "Прочитать документацию и сделать проект",
		},
		{
			id: "2",
			title: "Настроить проект",
			description: "Создать Vite проект",
		},
	],
	ready: [],
	inProgress: [],
	finished: [],
};

function App() {
	const [tasks, setTasks] = useState(() => {
		const saved = localStorage.getItem("kanban-tasks");
		return saved ? JSON.parse(saved) : INITIAL_TASKS;
	});

	const [searchQuery, setSearchQuery] = useState("");

	useEffect(() => {
		localStorage.setItem("kanban-tasks", JSON.stringify(tasks));
	}, [tasks]);

	const addTask = (title, description) => {
		const newTask = {
			id: Date.now().toString(),
			title,
			description,
		};
		setTasks((prev) => ({
			...prev,
			backlog: [newTask, ...prev.backlog],
		}));
	};

	const moveTask = (taskId, fromColumn, toColumn) => {
		if (fromColumn === toColumn) return;

		const task = tasks[fromColumn].find((t) => t.id === taskId);
		if (!task) return;

		setTasks((prev) => ({
			...prev,
			[fromColumn]: prev[fromColumn].filter((t) => t.id !== taskId),
			[toColumn]: [...prev[toColumn], task],
		}));
	};

	const deleteTask = (taskId, columnId) => {
		setTasks((prev) => ({
			...prev,
			[columnId]: prev[columnId].filter((t) => t.id !== taskId),
		}));
	};

	const updateTaskTitle = (taskId, columnId, newTitle) => {
		setTasks((prev) => ({
			...prev,
			[columnId]: prev[columnId].map((task) =>
				task.id === taskId ? { ...task, title: newTitle } : task,
			),
		}));
	};

	const getFilteredTasks = (columnId) => {
		if (!searchQuery.trim()) return tasks[columnId];

		const query = searchQuery.toLowerCase();
		return tasks[columnId].filter(
			(task) =>
				task.title.toLowerCase().includes(query) ||
				task.description.toLowerCase().includes(query),
		);
	};

	const columns = [...INITIAL_COLUMNS].sort((a, b) => a.order - b.order);

	return (
		<div
			style={{
				minHeight: "100vh",
				background: "#f5f5f5",
				padding: "20px",
			}}
		>
			<header
				style={{
					background: "white",
					padding: "20px",
					borderRadius: "12px",
					marginBottom: "20px",
					boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					flexWrap: "wrap",
					gap: "20px",
				}}
			>
				<h1 style={{ margin: 0, color: "#333" }}>Канбан-Доска задач</h1>
				<div style={{ flex: 1, maxWidth: "400px" }}>
					<input
						type="text"
						placeholder="Поиск задач..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						style={{
							width: "100%",
							padding: "10px 15px",
							border: "2px solid #e0e0e0",
							borderRadius: "8px",
							fontSize: "16px",
						}}
					/>
				</div>
			</header>

			<div style={{ marginBottom: "20px" }}>
				<AddTaskForm onAdd={addTask} />
			</div>

			<Board
				columns={columns}
				tasks={tasks}
				getFilteredTasks={getFilteredTasks}
				onMoveTask={moveTask}
				onDeleteTask={deleteTask}
				onUpdateTaskTitle={updateTaskTitle}
			/>
		</div>
	);
}

export default App;
