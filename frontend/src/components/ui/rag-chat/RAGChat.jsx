// src/components/ui/rag-chat/RAGChat.jsx
import React, { useState, useCallback, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useRAGWebSocket } from "./useRAGWebSocket";
import { ChatInput } from "../chat/chat-input";
import { StreamingMessage } from "./StreamingMessage";
import { FinalMessage } from "./FinalMessage";
import { chatService } from "./chatService"; // same folder as ChatsPage

const RAGChat = ({ model = "claude-sonnet-4-20250514", mode = "rag" }) => {
  // Read sessionId from the URL — works for both /rag-chat/:sessionId and
  // fresh chats with no session yet (sessionId will be undefined).
  const { sessionId: urlSessionId } = useParams();

  const [messages, setMessages] = useState([]);
  const [streamingMessage, setStreamingMessage] = useState(null);
  const [streamingEvents, setStreamingEvents] = useState([]);
  const [sessionId, setSessionId] = useState(urlSessionId ?? null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [sessionError, setSessionError] = useState(null);

  const streamingEventsRef = useRef([]);
  const currentSessionIdRef = useRef(urlSessionId ?? null);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const {
    isConnected,
    isProcessing,
    events,
    currentAnswer,
    thinking,
    sendQuery,
  } = useRAGWebSocket("ws://localhost:8000/api/v1/ws/query");

  // ─── Reset + reload whenever the URL session changes ──────────────────────
  // This handles navigating between existing chats without a full remount.
  useEffect(() => {
    const newSid = urlSessionId ?? null;
    setSessionId(newSid);
    currentSessionIdRef.current = newSid;
    setMessages([]);
    setStreamingMessage(null);
    setStreamingEvents([]);
    streamingEventsRef.current = [];
    setSessionError(null);

    if (!newSid) return;

    setIsLoadingHistory(true);
    chatService
      .getChatMessages(newSid)
      .then((saved) => {
        if (!saved?.length) return;
        const mapped = saved.map((m) => {
          try {
            // Content is a JSON-stringified message object
            return JSON.parse(m.content);
          } catch {
            // Fallback: plain text (shouldn't happen with simplified backend)
            return {
              id: m.id,
              role: m.role,
              content: m.content,
              timestamp: new Date(m.timestamp).getTime(),
              isStreaming: false,
            };
          }
        });
        setMessages(mapped);
      })
      .catch((err) => {
        console.error("Failed to load chat history:", err);
        setSessionError("Could not load chat history.");
      })
      .finally(() => setIsLoadingHistory(false));
  }, [urlSessionId]);

  // Keep streamingEventsRef in sync
  useEffect(() => {
    streamingEventsRef.current = streamingEvents;
  }, [streamingEvents]);

  // ─── Scroll ────────────────────────────────────────────────────────────────
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingEvents, scrollToBottom]);

  // ─── Lazy session creation (only for brand-new chats with no URL session) ──
  const ensureSession = useCallback(
    async (firstMessage) => {
      if (currentSessionIdRef.current) return currentSessionIdRef.current;
      try {
        const title =
          firstMessage.length > 50
            ? firstMessage.slice(0, 47) + "…"
            : firstMessage;
        const session = await chatService.createSession(mode, model, title);
        if (!session?.id) throw new Error("Invalid session response");
        setSessionId(session.id);
        currentSessionIdRef.current = session.id;
        return session.id;
      } catch (err) {
        console.error("Failed to create session:", err);
        setSessionError("Could not create chat session.");
        return null;
      }
    },
    [mode, model],
  );

  // ─── Streaming events → story cards ───────────────────────────────────────
  useEffect(() => {
    if (events.length === 0 && !thinking) return;
    const newEvent = events[events.length - 1];
    if (newEvent) {
      const card = createStoryCardFromEvent(newEvent);
      if (card) {
        setStreamingEvents((prev) => {
          const isDupe = prev.some(
            (e) => e.type === card.type && e.timestamp === card.timestamp,
          );
          return isDupe ? prev : [...prev, card];
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
  }, [events, thinking]);

  useEffect(() => {
    if (!thinking || !isProcessing) return;
    setStreamingEvents((prev) => [
      ...prev.filter((c) => c.type !== "thinking"),
      {
        id: `thinking_${Date.now()}`,
        type: "thinking",
        title: "Размышление",
        description: thinking,
        icon: "loading",
        color: "gray",
        timestamp: new Date().toLocaleTimeString(),
        isThinking: true,
      },
    ]);
  }, [thinking, isProcessing]);

  // ─── Final answer → commit + persist ──────────────────────────────────────
  useEffect(() => {
    if (!currentAnswer || isProcessing || !streamingMessage) return;

    const finalEvents = [
      ...streamingEventsRef.current,
      {
        id: `answer_${Date.now()}`,
        type: "answer",
        title: "✨ Финальный ответ",
        icon: "sparkles",
        color: "gradient",
        isAnswer: true,
        timestamp: new Date().toLocaleTimeString(),
      },
    ];

    const assistantMessage = {
      id: `assistant_${Date.now()}`,
      role: "assistant",
      content: currentAnswer,
      storyEvents: finalEvents,
      timestamp: Date.now(),
      isStreaming: false,
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setStreamingMessage(null);
    setStreamingEvents([]);

    const sid = currentSessionIdRef.current;
    if (sid) {
      chatService
        .saveMessage(sid, "assistant", assistantMessage)
        .catch((err) =>
          console.error("Failed to save assistant message:", err),
        );
    }
  }, [currentAnswer, isProcessing, streamingMessage]);

  // ─── Send ──────────────────────────────────────────────────────────────────
  const handleSendMessage = useCallback(
    async (messageText) => {
      if (!messageText.trim() || isProcessing) return;

      const userMessage = {
        id: `user_${Date.now()}`,
        role: "user",
        content: messageText,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setStreamingEvents([]);
      setStreamingMessage(null);

      const sid = await ensureSession(messageText);
      if (sid) {
        chatService
          .saveMessage(sid, "user", userMessage)
          .catch((err) => console.error("Failed to save user message:", err));
      }

      sendQuery(messageText);
    },
    [isProcessing, sendQuery, ensureSession],
  );

  // ─── Story card factory ────────────────────────────────────────────────────
  const createStoryCardFromEvent = (event) => {
    const ts = new Date().toLocaleTimeString();
    switch (event.type) {
      case "iteration_start":
        return {
          id: `iter_${Date.now()}_${Math.random()}`,
          type: "iteration",
          title: "Начало анализа",
          description: "Агент приступил к обработке вашего запроса",
          badge: `Максимум: ${event.data?.max_iterations} итераций`,
          details: {
            query: event.data?.query,
            maxIterations: event.data?.max_iterations,
          },
          icon: "zap",
          color: "purple",
          timestamp: ts,
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
          timestamp: ts,
        };
      case "tool_call":
        return {
          id: `tool_${Date.now()}_${Math.random()}`,
          type: "tool_call",
          title: "Вызов инструмента",
          description: "Поиск в базе знаний",
          badge: event.data?.tool_name,
          details: event.data?.arguments,
          icon: "search",
          color: "orange",
          timestamp: ts,
        };
      case "tool_result": {
        let documents = null;
        let resultPreview = event.data?.result_preview || "Нет данных";
        try {
          if (event.data?.result_preview?.trim().startsWith("[")) {
            const parsed = JSON.parse(event.data.result_preview);
            if (Array.isArray(parsed) && parsed[0]?.document !== undefined) {
              documents = parsed;
              resultPreview = `Найдено ${parsed.length} документов`;
            }
          }
        } catch (_) {}
        return {
          id: `result_${Date.now()}_${Math.random()}`,
          type: "tool_result",
          title: event.data?.success
            ? "Информация найдена"
            : "Результат поиска",
          description: event.data?.success
            ? `Успешно найдено${event.data?.result_length ? " " + Math.ceil(event.data.result_length / 1000) + "KB" : ""} данных`
            : "Не удалось найти точную информацию",
          details: resultPreview,
          documents,
          resultLength: event.data?.result_length,
          icon: event.data?.success ? "check" : "alert",
          color: event.data?.success ? "green" : "red",
          timestamp: ts,
        };
      }
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
          timestamp: ts,
        };
      case "error":
        return {
          id: `error_${Date.now()}_${Math.random()}`,
          type: "error",
          title: "Ошибка",
          description: event.content || "Произошла ошибка при обработке",
          icon: "error",
          color: "red",
          timestamp: ts,
        };
      default:
        return null;
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="w-full h-full flex flex-col">
      {sessionError && (
        <div className="bg-destructive/10 text-destructive text-sm px-4 py-2 text-center">
          {sessionError}
        </div>
      )}

      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto"
        style={{ paddingBottom: "80px" }}
      >
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="h-4" />

          {isLoadingHistory ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground text-sm gap-2">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Loading history…
            </div>
          ) : (
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

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

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
