import { useEffect, useState, useCallback, useRef } from "react";

const useWebSocket = (url) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    try {
      const socket = new WebSocket(url);

      socket.onopen = () => {
        console.log("WebSocket подключен");
        setIsConnected(true);
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setLastMessage(data);
        } catch (error) {
          console.error("Ошибка парсинга:", error);
        }
      };

      socket.onerror = (error) => {
        console.error("WebSocket ошибка:", error);
        setIsConnected(false);
      };

      socket.onclose = () => {
        console.log("WebSocket отключен");
        setIsConnected(false);
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 3000);
      };

      wsRef.current = socket;
    } catch (error) {
      console.error("Ошибка подключения:", error);
      setIsConnected(false);
      reconnectTimeoutRef.current = setTimeout(() => {
        connect();
      }, 3000);
    }
  }, [url]);

  useEffect(() => {
    connect();
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  const sendMessage = useCallback((data) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
      return true;
    }
    console.warn("WebSocket не подключен");
    return false;
  }, []);

  return { isConnected, sendMessage, lastMessage };
};

export default useWebSocket;