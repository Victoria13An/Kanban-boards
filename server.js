import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

console.log("WebSocket сервер запущен на ws://localhost:8080");

wss.on("connection", (ws) => {
	console.log("✅ Клиент подключился");

	ws.on("message", (data) => {
		const message = data.toString();
		console.log("📨 Получено:", message);

		// Отправляем всем остальным клиентам
		wss.clients.forEach((client) => {
			if (client !== ws && client.readyState === WebSocket.OPEN) {
				client.send(message);
			}
		});
	});

	ws.on("close", () => {
		console.log("❌ Клиент отключился");
	});
});
