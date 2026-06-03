import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 5000;
const WS_PORT = 8080;


app.use(cors());
app.use(express.json());


let tasks = [
  { 
    id: '1', 
    title: 'Изучить React', 
    description: 'Прочитать документацию и пройти туториал', 
    columnId: 'backlog' 
  },
  { 
    id: '2', 
    title: 'Настроить проект', 
    description: 'Создать Vite проект и установить зависимости', 
    columnId: 'backlog' 
  },
  { 
    id: '3', 
    title: 'Написать тесты', 
    description: 'Покрыть код юнит-тестами', 
    columnId: 'ready' 
  }
];


app.get('/api/tasks', (req, res) => {
  console.log('GET /api/tasks - возвращаем задачи');
  res.json(tasks);
});

app.post('/api/tasks', (req, res) => {
  const newTask = { 
    ...req.body, 
    id: Date.now().toString() 
  };
  tasks.push(newTask);
  console.log('POST /api/tasks - добавлена задача:', newTask);
  res.json(newTask);
});

app.put('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  tasks = tasks.map(task => 
    task.id === id ? { ...task, ...updates } : task
  );
  console.log('PUT /api/tasks/:id - обновлена задача:', id);
  res.json(tasks.find(task => task.id === id));
});

app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  tasks = tasks.filter(task => task.id !== id);
  console.log('DELETE /api/tasks/:id - удалена задача:', id);
  res.json({ success: true });
});


app.listen(PORT, () => {
  console.log(`✅ HTTP сервер запущен на http://localhost:${PORT}`);
});


const wss = new WebSocketServer({ port: WS_PORT });
console.log(`✅ WebSocket сервер запущен на порту ${WS_PORT}`);


const clients = new Set();

wss.on('connection', (ws) => {
  console.log('🔌 Новый клиент подключен к WebSocket');
  clients.add(ws);


  ws.send(JSON.stringify({
    type: 'TASKS_UPDATE',
    payload: tasks
  }));

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      console.log('📨 Получено WebSocket сообщение:', data.type);

      switch (data.type) {
        case 'ADD_TASK':
          const newTask = {
            id: Date.now().toString(),
            ...data.payload,
            columnId: data.payload.columnId || 'backlog'
          };
          tasks.push(newTask);
          broadcastMessage({
            type: 'TASK_ADDED',
            payload: newTask
          });
          console.log('✅ Задача добавлена:', newTask.title);
          break;

        case 'UPDATE_TASK':
          tasks = tasks.map(task => 
            task.id === data.payload.id 
              ? { ...task, ...data.payload }
              : task
          );
          broadcastMessage({
            type: 'TASKS_UPDATE',
            payload: tasks
          });
          console.log('🔄 Задача обновлена:', data.payload.id);
          break;

        case 'DELETE_TASK':
          tasks = tasks.filter(task => task.id !== data.payload.id);
          broadcastMessage({
            type: 'TASK_DELETED',
            payload: data.payload
          });
          console.log('🗑️ Задача удалена:', data.payload.id);
          break;

        case 'MOVE_TASK':
          const { taskId, fromColumn, toColumn } = data.payload;
          tasks = tasks.map(task => 
            task.id === taskId 
              ? { ...task, columnId: toColumn }
              : task
          );
          broadcastMessage({
            type: 'TASKS_UPDATE',
            payload: tasks
          });
          console.log(`📦 Задача ${taskId} перемещена из ${fromColumn} в ${toColumn}`);
          break;

        case 'UPDATE_TITLE':
          tasks = tasks.map(task =>
            task.id === data.payload.taskId
              ? { ...task, title: data.payload.newTitle }
              : task
          );
          broadcastMessage({
            type: 'TASKS_UPDATE',
            payload: tasks
          });
          console.log('✏️ Заголовок задачи обновлен:', data.payload.taskId);
          break;

        case 'SYNC':

          broadcastMessage(data, ws);
          console.log('🔄 Синхронизация с клиентами');
          break;

        default:
          console.log('❓ Неизвестный тип сообщения:', data.type);
      }
    } catch (error) {
      console.error('❌ Ошибка обработки сообщения:', error);
    }
  });

  ws.on('close', () => {
    console.log('🔌 Клиент отключен от WebSocket');
    clients.delete(ws);
  });

  ws.on('error', (error) => {
    console.error('❌ WebSocket ошибка:', error);
    clients.delete(ws);
  });
});


function broadcastMessage(message, excludeClient = null) {
  const messageStr = JSON.stringify(message);
  let sentCount = 0;
  
  clients.forEach(client => {
    if (client !== excludeClient && client.readyState === 1) { 
      client.send(messageStr);
      sentCount++;
    }
  });
  
  console.log(`📡 Сообщение отправлено ${sentCount} клиентам`);
}

console.log(`🚀 Сервер запущен и готов к работе!`);
console.log(`📡 REST API: http://localhost:${PORT}/api/tasks`);
console.log(`🔌 WebSocket: ws://localhost:${WS_PORT}`);