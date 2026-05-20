import React, { useState, useEffect } from "react";
import Board from "./components/Board";
import AddTaskForm from "./components/AddTaskForm";
import useWebSocket from "./hooks/useWebSocket";

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
			description: "Прочитать документацию",
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

// WebSocket сервер (можно использовать публичный тестовый)
const WS_URL = "ws://localhost:8080";

function App() {
	const [tasks, setTasks] = useState(() => {
		const saved = localStorage.getItem("kanban-tasks");
		return saved ? JSON.parse(saved) : INITIAL_TASKS;
	});
	const [searchQuery, setSearchQuery] = useState("");

	const { isConnected, sendMessage, lastMessage } = useWebSocket(WS_URL);

	// Сохраняем в localStorage
	useEffect(() => {
		localStorage.setItem("kanban-tasks", JSON.stringify(tasks));
	}, [tasks]);

	// Отправляем изменения через WebSocket
	const syncViaWebSocket = (action, data) => {
		sendMessage({
			type: "SYNC",
			action,
			data,
			timestamp: Date.now(),
			userId: localStorage.getItem("userId") || generateUserId(),
		});
	};

	// Генерация уникального ID пользователя
	const generateUserId = () => {
		const id = "user_" + Math.random().toString(36).substr(2, 9);
		localStorage.setItem("userId", id);
		return id;
	};

	// Получаем обновления от других пользователей
	useEffect(() => {
		if (lastMessage && lastMessage.type === "SYNC") {
			const { action, data } = lastMessage;
			const currentUserId = localStorage.getItem("userId");

			// Не обрабатываем свои же сообщения
			if (lastMessage.userId === currentUserId) return;

			console.log("Получено обновление:", action, data);

			switch (action) {
				case "ADD_TASK":
					setTasks((prev) => ({
						...prev,
						backlog: [data.task, ...prev.backlog],
					}));
					break;

				case "MOVE_TASK":
					setTasks((prev) => ({
						...prev,
						[data.fromColumn]: prev[data.fromColumn].filter(
							(t) => t.id !== data.taskId,
						),
						[data.toColumn]: [...prev[data.toColumn], data.task],
					}));
					break;

				case "DELETE_TASK":
					setTasks((prev) => ({
						...prev,
						[data.columnId]: prev[data.columnId].filter(
							(t) => t.id !== data.taskId,
						),
					}));
					break;

				case "UPDATE_TITLE":
					setTasks((prev) => ({
						...prev,
						[data.columnId]: prev[data.columnId].map((task) =>
							task.id === data.taskId
								? { ...task, title: data.newTitle }
								: task,
						),
					}));
					break;

				default:
					break;
			}
		}
	}, [lastMessage]);

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

		// Отправляем через WebSocket
		syncViaWebSocket("ADD_TASK", { task: newTask });
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

		// Отправляем через WebSocket
		syncViaWebSocket("MOVE_TASK", {
			taskId,
			fromColumn,
			toColumn,
			task,
		});
	};

	const deleteTask = (taskId, columnId) => {
		setTasks((prev) => ({
			...prev,
			[columnId]: prev[columnId].filter((t) => t.id !== taskId),
		}));

		// Отправляем через WebSocket
		syncViaWebSocket("DELETE_TASK", { taskId, columnId });
	};

	const updateTaskTitle = (taskId, columnId, newTitle) => {
		setTasks((prev) => ({
			...prev,
			[columnId]: prev[columnId].map((task) =>
				task.id === taskId ? { ...task, title: newTitle } : task,
			),
		}));

		// Отправляем через WebSocket
		syncViaWebSocket("UPDATE_TITLE", { taskId, columnId, newTitle });
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
				<div>
					<h1 style={{ margin: 0, color: "#333" }}>
						Канбан-Доска задач
					</h1>
					<div
						style={{
							fontSize: "12px",
							marginTop: "5px",
							color: isConnected ? "green" : "red",
						}}
					>
						{isConnected
							? "🟢 WebSocket подключен"
							: "🔴 WebSocket отключен"}
					</div>
				</div>
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
