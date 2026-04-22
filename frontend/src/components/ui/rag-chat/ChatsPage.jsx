// src/components/ui/rag-chat/ChatsPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MessageSquare,
  Plus,
  Trash2,
  Clock,
  Bot,
  Calendar,
  Search,
  X,
} from "lucide-react";
import { useAuth } from "../auth-component";
import { chatService } from "./chatService"; // ← same folder, same instance as RAGChat

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
      // Create the session now so the title can be updated later from the first message.
      // RAGChat will receive the sessionId from the URL and skip its own ensureSession.
      const newSession = await chatService.createSession(
        "rag",
        "claude-sonnet-4-20250514",
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

  const handleDeleteChat = async (e, sessionId) => {
    e.stopPropagation();
    if (
      !window.confirm(
        "Are you sure you want to delete this chat? This action cannot be undone.",
      )
    )
      return;
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

  const handleOpenChat = (sessionId) => navigate(`/rag-chat/${sessionId}`);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const diffMs = Date.now() - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString();
  };

  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (authLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <Bot className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">Please login to continue</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                My Chats
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Continue your conversations or start new ones
              </p>
            </div>
            <button
              onClick={handleNewChat}
              disabled={isCreating}
              className="px-5 py-2.5 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white rounded-xl font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  <span>New Chat</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
        </div>

        {/* List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-500">Loading chats...</p>
            </div>
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
            {searchQuery ? (
              <>
                <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  No chats found for "{searchQuery}"
                </p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-4 text-primary hover:underline"
                >
                  Clear search
                </button>
              </>
            ) : (
              <>
                <Bot className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-2">
                  No conversations yet
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">
                  Start your first conversation
                </p>
                <button
                  onClick={handleNewChat}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" /> New Chat
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSessions.map((session) => (
              <div
                key={session.id}
                onClick={() => handleOpenChat(session.id)}
                className="group bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-primary/50 hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5">
                      <MessageSquare className="h-5 w-5 text-primary" />
                    </div>
                    <button
                      onClick={(e) => handleDeleteChat(e, session.id)}
                      disabled={deletingId === session.id}
                      className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg transition-all duration-200 disabled:opacity-50"
                    >
                      {deletingId === session.id ? (
                        <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 text-red-500" />
                      )}
                    </button>
                  </div>

                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 text-lg">
                    {session.title}
                  </h3>

                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mt-3">
                    <div className="flex items-center gap-1.5">
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>{session.messageCount ?? 0} messages</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{formatDate(session.updatedAt)}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Calendar className="h-3 w-3" />
                      <span>
                        Created:{" "}
                        {new Date(session.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="h-1 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        )}

        {!isLoading && sessions.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              Total {sessions.length} chat{sessions.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>

      {isCreating && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 flex items-center gap-3 shadow-2xl">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-700 dark:text-gray-300">
              Creating new chat...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
