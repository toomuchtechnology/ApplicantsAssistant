// src/components/ui/rag-chat/RAGChat.jsx
import React, { useState, useCallback, useEffect, useRef } from "react";
import { User } from "lucide-react";
import { useRAGWebSocket } from "./useRAGWebSocket";
import { ChatInput } from "../chat/chat-input";
import { StreamingMessage } from "./StreamingMessage";
import { FinalMessage } from "./FinalMessage";

const RAGChat = () => {
  const [messages, setMessages] = useState([]);
  const [streamingMessage, setStreamingMessage] = useState(null);
  const [streamingEvents, setStreamingEvents] = useState([]);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const {
    isConnected,
    isProcessing,
    events,
    currentAnswer,
    error,
    thinking,
    sendQuery,
  } = useRAGWebSocket("ws://localhost:8000/api/v1/ws/query");

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingEvents, scrollToBottom]);

  // Handle streaming events - incremental updates
  useEffect(() => {
    if (events.length > 0 || thinking) {
      const newEvent = events[events.length - 1];

      if (newEvent) {
        const storyCard = createStoryCardFromEvent(newEvent);
        if (storyCard) {
          setStreamingEvents((prev) => {
            const isDuplicate = prev.some(
              (event) =>
                event.type === storyCard.type &&
                event.timestamp === storyCard.timestamp,
            );
            return isDuplicate ? prev : [...prev, storyCard];
          });
        }
      }

      if (!streamingMessage && (events.length > 0 || thinking)) {
        setStreamingMessage({
          id: `streaming_${Date.now()}`,
          role: "assistant",
          timestamp: Date.now(),
          isStreaming: true,
        });
      }
    }
  }, [events, thinking]);

  // Handle thinking indicator
  useEffect(() => {
    if (thinking && isProcessing) {
      const thinkingCard = {
        id: `thinking_${Date.now()}`,
        type: "thinking",
        title: "Размышление",
        description: thinking,
        icon: "loading",
        color: "gray",
        timestamp: new Date().toLocaleTimeString(),
        isThinking: true,
      };

      setStreamingEvents((prev) => {
        const filtered = prev.filter((card) => card.type !== "thinking");
        return [...filtered, thinkingCard];
      });
    }
  }, [thinking, isProcessing]);

  // Handle final answer
  useEffect(() => {
    if (currentAnswer && !isProcessing && streamingMessage) {
      const answerCard = {
        id: `answer_${Date.now()}`,
        type: "answer",
        title: "✨ Финальный ответ",
        icon: "sparkles",
        color: "gradient",
        isAnswer: true,
        timestamp: new Date().toLocaleTimeString(),
      };

      const finalEvents = [...streamingEvents, answerCard];

      const finalMessage = {
        id: `assistant_${Date.now()}`,
        role: "assistant",
        content: currentAnswer,
        storyEvents: finalEvents,
        timestamp: Date.now(),
        isStreaming: false,
      };

      setMessages((prev) => [...prev, finalMessage]);
      setStreamingMessage(null);
      setStreamingEvents([]);
    }
  }, [currentAnswer, isProcessing, streamingMessage, streamingEvents]);

  const handleSendMessage = useCallback(
    async (messageText) => {
      if (!messageText.trim() || isProcessing) return;

      const userMessage = {
        id: `user_${Date.now()}`,
        content: messageText,
        role: "user",
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setStreamingEvents([]);
      setStreamingMessage(null);
      sendQuery(messageText);
    },
    [isProcessing, sendQuery],
  );

  const createStoryCardFromEvent = (event) => {
    switch (event.type) {
      case "iteration_start":
        return {
          id: `iter_${Date.now()}_${Math.random()}`,
          type: "iteration",
          title: "Начало анализа",
          description: `Агент приступил к обработке вашего запроса`,
          badge: `Максимум: ${event.data?.max_iterations} итераций`,
          details: {
            query: event.data?.query,
            maxIterations: event.data?.max_iterations,
          },
          icon: "zap",
          color: "purple",
          timestamp: new Date().toLocaleTimeString(),
        };
      case "llm_response":
        return {
          id: `llm_${Date.now()}_${Math.random()}`,
          type: "decision",
          title: event.data?.has_tool_calls
            ? "Принятие решения"
            : "Формирование ответа",
          description: event.data?.has_tool_calls
            ? `Агент решил использовать ${event.data.tool_call_count} инструмент(ов) для поиска`
            : "Агент готовит финальный ответ на основе найденной информации",
          details: event.data,
          icon: event.data?.has_tool_calls ? "wrench" : "brain",
          color: "emerald",
          timestamp: new Date().toLocaleTimeString(),
        };
      case "tool_call":
        return {
          id: `tool_${Date.now()}_${Math.random()}`,
          type: "tool_call",
          title: `Вызов инструмента`,
          description: `Поиск в базе знаний`,
          badge: event.data?.tool_name,
          details: event.data?.arguments,
          icon: "search",
          color: "orange",
          timestamp: new Date().toLocaleTimeString(),
        };
      case "tool_result":
        // Parse documents if they exist in the result
        let documents = null;
        let resultPreview = event.data?.result_preview || "Нет данных";

        try {
          // Try to parse if result_preview contains JSON array of documents
          if (
            event.data?.result_preview &&
            event.data?.result_preview.trim().startsWith("[")
          ) {
            const parsed = JSON.parse(event.data?.result_preview);
            if (
              Array.isArray(parsed) &&
              parsed.length > 0 &&
              parsed[0].document !== undefined
            ) {
              documents = parsed;
              resultPreview = `Найдено ${parsed.length} документов`;
            }
          }
        } catch (e) {
          // Not JSON, keep as is
          console.log("Result is not JSON format, showing as text");
        }

        return {
          id: `result_${Date.now()}_${Math.random()}`,
          type: "tool_result",
          title: event.data?.success
            ? "Информация найдена"
            : "Результат поиска",
          description: event.data?.success
            ? `Успешно найден${event.data?.result_length ? "о " + Math.ceil(event.data.result_length / 1000) + "KB" : ""} данных`
            : "Не удалось найти точную информацию",
          details: resultPreview,
          documents: documents,
          resultLength: event.data?.result_length,
          icon: event.data?.success ? "check" : "alert",
          color: event.data?.success ? "green" : "red",
          timestamp: new Date().toLocaleTimeString(),
        };
      case "complete":
        return {
          id: `complete_${Date.now()}_${Math.random()}`,
          type: "complete",
          title: "Обработка завершена",
          description:
            event.data?.status === "success"
              ? "Агент успешно обработал ваш запрос"
              : "Обработка завершена",
          icon: "sparkles",
          color: "blue",
          timestamp: new Date().toLocaleTimeString(),
        };
      case "error":
        return {
          id: `error_${Date.now()}_${Math.random()}`,
          type: "error",
          title: "Ошибка",
          description: event.content || "Произошла ошибка при обработке",
          icon: "error",
          color: "red",
          timestamp: new Date().toLocaleTimeString(),
        };
      default:
        return null;
    }
  };

  // Calculate input height for padding (approx 80px for input + padding)
  const INPUT_HEIGHT = 80;

  return (
    <div className="w-full h-full flex flex-col">
      {/* Chat Container with bottom padding equal to input height */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto"
        style={{ paddingBottom: `${INPUT_HEIGHT}px` }}
      >
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
          {/* Top spacer */}
          <div className="h-4" />

          {/* Messages */}
          <div className="space-y-6">
            {messages.map((message) =>
              message.role === "user" ? (
                <div
                  key={message.id}
                  className="flex justify-end animate-in fade-in slide-in-from-bottom-2 duration-300"
                >
                  <div className="max-w-[85%] md:max-w-[70%]">
                    <div className="rounded-2xl px-5 py-3 bg-primary text-primary-foreground">
                      <p className="text-sm md:text-base whitespace-pre-wrap break-words">
                        {message.content}
                      </p>
                      <p className="text-xs mt-1.5 text-primary-foreground/70">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <FinalMessage key={message.id} message={message} />
              ),
            )}

            <StreamingMessage
              isProcessing={isProcessing}
              streamingMessage={streamingMessage}
              streamingEvents={streamingEvents}
              currentAnswer={currentAnswer}
            />

            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Fixed Chat Input - No border, clean */}
      <ChatInput
        onSend={handleSendMessage}
        isLoading={isProcessing}
        placeholder="Задайте вопрос о документах..."
        disabled={!isConnected}
        isConnected={isConnected}
        models={[]}
        selectedModel=""
        onModelChange={() => {}}
      />
    </div>
  );
};

export default RAGChat;
