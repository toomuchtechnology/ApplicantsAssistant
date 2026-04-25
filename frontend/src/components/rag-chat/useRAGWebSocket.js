// hooks/useRAGWebSocket.js
import { useState, useCallback, useRef, useEffect } from "react";

export const useRAGWebSocket = (url) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [events, setEvents] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [error, setError] = useState(null);

  const wsRef = useRef(null);
  const eventHandlersRef = useRef({});

  // Register event handlers
  const on = useCallback((eventType, handler) => {
    eventHandlersRef.current[eventType] = handler;
  }, []);

  // Remove event handler
  const off = useCallback((eventType) => {
    delete eventHandlersRef.current[eventType];
  }, []);

  // Connect to WebSocket
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log("WebSocket already connected");
      return;
    }

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true);
      setError(null);

      if (eventHandlersRef.current["open"]) {
        eventHandlersRef.current["open"]();
      }
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);

        // Add to event history
        setEvents((prev) => [...prev, message]);

        // Handle different message types
        switch (message.type) {
          case "thinking":
            if (eventHandlersRef.current["thinking"]) {
              eventHandlersRef.current["thinking"](message.content);
            }
            break;

          case "iteration_start":
            if (eventHandlersRef.current["iteration_start"]) {
              eventHandlersRef.current["iteration_start"](message.data);
            }
            break;

          case "llm_response":
            if (eventHandlersRef.current["llm_response"]) {
              eventHandlersRef.current["llm_response"](message.data);
            }
            break;

          case "tool_call":
            if (eventHandlersRef.current["tool_call"]) {
              eventHandlersRef.current["tool_call"](message.data);
            }
            break;

          case "tool_result":
            if (eventHandlersRef.current["tool_result"]) {
              eventHandlersRef.current["tool_result"](message.data);
            }
            break;

          case "answer":
            setCurrentAnswer(message.content);
            if (eventHandlersRef.current["answer"]) {
              eventHandlersRef.current["answer"](message.content);
            }
            break;

          case "complete":
            setIsProcessing(false);
            if (eventHandlersRef.current["complete"]) {
              eventHandlersRef.current["complete"](
                message.data || message.content,
              );
            }
            break;

          case "error":
            setError(message.content);
            setIsProcessing(false);
            if (eventHandlersRef.current["error"]) {
              eventHandlersRef.current["error"](message.content);
            }
            break;

          default:
            console.log("Unknown message type:", message.type);
            if (eventHandlersRef.current[message.type]) {
              eventHandlersRef.current[message.type](message);
            }
        }
      } catch (err) {
        console.error("Failed to parse message:", err);
        setError("Failed to parse server message");
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setError("WebSocket connection error");
      setIsConnected(false);

      if (eventHandlersRef.current["error"]) {
        eventHandlersRef.current["error"]("Connection error");
      }
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
      setIsConnected(false);
      setIsProcessing(false);

      if (eventHandlersRef.current["close"]) {
        eventHandlersRef.current["close"]();
      }
    };
  }, [url]);

  // Disconnect WebSocket
  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  // Send query
  const sendQuery = useCallback((query, options = {}) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      setError("WebSocket is not connected");
      return false;
    }

    const message = {
      type: "query",
      payload: {
        query,
        ...options,
      },
    };

    wsRef.current.send(JSON.stringify(message));
    setIsProcessing(true);
    setCurrentAnswer("");
    setEvents([]);
    setError(null);

    return true;
  }, []);

  // Clear events
  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  // Auto-connect on mount
  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected,
    isProcessing,
    events,
    currentAnswer,
    error,
    sendQuery,
    connect,
    disconnect,
    clearEvents,
    on,
    off,
  };
};
