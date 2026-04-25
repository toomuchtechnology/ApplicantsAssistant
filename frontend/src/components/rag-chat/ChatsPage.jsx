// src/components/ui/rag-chat/ChatsPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Bot, Search, X, Sparkles, MessagesSquare } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { AuthComponent } from "../auth";

import { chatService } from "./chatService";
import { Button } from "@/components/ui/button";
import { ChatCard } from "./ChatCard";

// ── Animated "not authenticated" state ──────────────────────────────────────
const UnauthenticatedState = () => (
  <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6">
    <style>{`
      @keyframes shimmer {
        0%   { background-position: -200% center; }
        100% { background-position:  200% center; }
      }
      .login-shimmer-wrap {
        background: linear-gradient(
          90deg,
          hsl(var(--primary)) 0%,
          hsl(var(--primary) / 0.65) 40%,
          hsl(var(--primary)) 60%,
          hsl(var(--primary) / 0.65) 100%
        );
        background-size: 200% auto;
        animation: shimmer 2.4s linear infinite;
        border-radius: 12px;
        padding: 1.5px;
      }
      @keyframes float-ring {
        0%, 100% { transform: scale(1);    opacity: 0.18; }
        50%       { transform: scale(1.07); opacity: 0.3;  }
      }
      .ring-a { animation: float-ring 3s   ease-in-out infinite; }
      .ring-b { animation: float-ring 3s   ease-in-out infinite 0.6s; }
      .ring-c { animation: float-ring 3s   ease-in-out infinite 1.2s; }
    `}</style>

    <div className="w-full max-w-sm text-center">
      {/* Floating rings */}
      <div className="relative flex items-center justify-center mb-8">
        <span className="ring-a absolute w-32 h-32 rounded-full border-2 border-blue-300 dark:border-blue-700" />
        <span
          className="ring-b absolute rounded-full border border-blue-300/70 dark:border-blue-700/70"
          style={{ width: 88, height: 88 }}
        />
        <span className="ring-c absolute w-16 h-16 rounded-full border border-blue-200 dark:border-blue-800" />
        <div className="relative z-10 w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-xl shadow-blue-500/30">
          <Bot className="h-7 w-7 text-white" />
        </div>
      </div>

      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
        Добро пожаловать
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
        Войдите в аккаунт, чтобы начать общение
        <br />с ассистентом абитуриента
      </p>

      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {["Умный поиск", "История чатов", "Быстрые ответы"].map((f) => (
          <span
            key={f}
            className="text-xs px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700"
          >
            {f}
          </span>
        ))}
      </div>

      {/* Shimmer-border animated login button */}
      <div className="flex flex-col items-center gap-2">
        <div className="relative group">
          {/* Glow halo */}
          <div className="absolute inset-0 rounded-xl bg-primary/25 blur-lg scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          {/* Shimmer gradient border */}
          <div className="login-shimmer-wrap">
            <div className="rounded-[10px] bg-white dark:bg-gray-950 px-6 py-2.5 flex items-center justify-center min-w-[180px]">
              <AuthComponent />
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          Через Google аккаунт — быстро и безопасно
        </p>
      </div>
    </div>
  </div>
);

// ── Animated "no chats" empty state ─────────────────────────────────────────
const EmptyChatsState = ({ onNewChat, isCreating }) => (
  <div className="flex items-center justify-center py-16">
    <style>{`
      @keyframes orbit {
        from { transform: rotate(0deg) translateX(44px) rotate(0deg); }
        to   { transform: rotate(360deg) translateX(44px) rotate(-360deg); }
      }
    `}</style>
    <div className="w-full max-w-sm text-center">
      <div className="relative flex items-center justify-center mb-8 h-24">
        {[
          {
            dur: "4s",
            dir: "normal",
            sz: 8,
            color: "hsl(var(--primary) / 0.4)",
            delay: "0s",
          },
          {
            dur: "6s",
            dir: "reverse",
            sz: 6,
            color: "hsl(217 91% 60% / 0.45)",
            delay: "0s",
          },
          {
            dur: "5s",
            dir: "normal",
            sz: 5,
            color: "hsl(var(--primary) / 0.25)",
            delay: "1.5s",
          },
        ].map((dot, i) => (
          <span
            key={i}
            style={{
              position: "absolute",
              width: dot.sz,
              height: dot.sz,
              borderRadius: "50%",
              background: dot.color,
              top: "50%",
              left: "50%",
              marginTop: -dot.sz / 2,
              marginLeft: -dot.sz / 2,
              animation: `orbit ${dot.dur} linear infinite ${dot.dir}`,
              animationDelay: dot.delay,
            }}
          />
        ))}
        <div className="relative z-10 w-16 h-16 rounded-2xl bg-white dark:bg-gray-900 border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center shadow-sm">
          <MessagesSquare className="h-7 w-7 text-gray-400 dark:text-gray-500" />
          <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-md">
            <Sparkles className="h-3 w-3 text-primary-foreground" />
          </div>
        </div>
      </div>
      <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">
        Нет ни одного чата
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
        Задайте вопрос об условиях поступления,
        <br />
        экзаменах или студенческой жизни
      </p>
      <Button
        size="sm"
        onClick={onNewChat}
        disabled={isCreating}
        className="gap-2"
      >
        {isCreating ? (
          <>
            <div className="w-3.5 h-3.5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            Создание...
          </>
        ) : (
          <>
            <Plus className="h-3.5 w-3.5" />
            Начать первый чат
          </>
        )}
      </Button>
    </div>
  </div>
);

// ── Main page ────────────────────────────────────────────────────────────────
export const ChatsPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const loadSessions = async () => {
    setIsLoading(true);
    try {
      const data = await chatService.getChatSessions();
      setSessions(data || []);
    } catch (error) {
      console.error("Failed to load sessions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && !authLoading) loadSessions();
  }, [isAuthenticated, authLoading]);

  const handleNewChat = async () => {
    setIsCreating(true);
    try {
      const newSession = await chatService.createSession(
        "rag",
        import.meta.env.OPENROUTER_MODEL,
        "New Chat",
      );
      if (!newSession?.id) throw new Error("No session id returned");
      setSessions((prev) => [newSession, ...prev]);
      navigate(`/rag-chat/${newSession.id}`);
    } catch (error) {
      console.error("Failed to create chat:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (sessionId) => {
    if (!window.confirm("Вы уверены? Это действие нельзя отменить.")) return;
    setDeletingId(sessionId);
    try {
      await chatService.deleteSession(sessionId);
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    } catch (error) {
      console.error("Failed to delete chat:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleRename = async (sessionId, newTitle) => {
    await chatService.updateSessionTitle(sessionId, newTitle);
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, title: newTitle } : s)),
    );
  };

  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (authLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-7 h-7 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Загрузка...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return <UnauthenticatedState />;

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            Мои чаты
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Продолжайте прошлые беседы или начните новую
          </p>
        </div>

        {/* Toolbar */}
        <div className="mb-6 flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 h-9 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-sm flex-shrink-0 select-none">
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              {sessions.length}
            </span>
            <span className="hidden sm:inline text-gray-500 dark:text-gray-400">
              чатов
            </span>
          </div>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Поиск чатов..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-8 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <Button
            onClick={handleNewChat}
            disabled={isCreating}
            size="sm"
            className="gap-2 flex-shrink-0 h-9"
          >
            {isCreating ? (
              <div className="w-3.5 h-3.5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">
              {isCreating ? "Создание..." : "Новый чат"}
            </span>
          </Button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-3">
              <div className="w-7 h-7 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Загрузка чатов...
              </p>
            </div>
          </div>
        ) : filteredSessions.length === 0 ? (
          searchQuery ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-full max-w-xs text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 inline-flex">
                    <Search className="h-6 w-6 text-gray-400" />
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Ничего не найдено
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  Нет чатов с названием «{searchQuery}»
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchQuery("")}
                  className="gap-1.5"
                >
                  <X className="h-3.5 w-3.5" />
                  Сбросить поиск
                </Button>
              </div>
            </div>
          ) : (
            <EmptyChatsState
              onNewChat={handleNewChat}
              isCreating={isCreating}
            />
          )
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSessions.map((session) => (
              <ChatCard
                key={session.id}
                session={session}
                onDelete={handleDelete}
                onRename={handleRename}
                isDeleting={deletingId === session.id}
              />
            ))}
          </div>
        )}
      </div>

      {isCreating && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 px-5 py-4 flex items-center gap-3 shadow-xl">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Создание чата...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
