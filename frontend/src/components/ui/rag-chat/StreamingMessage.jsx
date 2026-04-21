// src/components/ui/rag-chat/StreamingMessage.jsx
import React, { useState } from "react";
import { Bot, Sparkles, ChevronUp, ChevronDown, Loader2 } from "lucide-react";
import { StoryCard } from "./StoryCard";

export const StreamingMessage = ({
  isProcessing,
  streamingMessage,
  streamingEvents,
  currentAnswer,
}) => {
  const [expanded, setExpanded] = useState(true);

  if (!streamingMessage) return null;

  return (
    <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex-shrink-0">
        <div className="p-2 rounded-full bg-primary/10">
          <Bot className="h-5 w-5 text-primary" />
        </div>
      </div>

      <div className="flex-1 rounded-xl bg-card border border-border shadow-sm overflow-hidden">
        {/* Storyline Header */}
        <div
          onClick={() => setExpanded(!expanded)}
          className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 cursor-pointer hover:from-primary/10 hover:to-primary/15 transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <span className="font-semibold text-sm">История обработки</span>
              {isProcessing && (
                <div className="flex items-center gap-1 ml-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-xs text-primary font-medium">
                    В процессе
                  </span>
                </div>
              )}
              {streamingEvents.length > 0 && (
                <span className="text-xs text-gray-500 ml-1">
                  ({streamingEvents.length} шагов)
                </span>
              )}
            </div>
            {expanded ? (
              <ChevronUp className="h-4 w-4 text-gray-500 transition-transform" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500 transition-transform" />
            )}
          </div>
        </div>

        {/* Storyline Content */}
        {expanded && (
          <div className="p-4 space-y-2 border-t border-border">
            {streamingEvents.map((event, idx) => (
              <div
                key={event.id}
                className="animate-in fade-in slide-in-from-bottom-2 duration-300"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <StoryCard card={event} />
              </div>
            ))}

            {isProcessing && streamingEvents.length === 0 && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                <div className="relative">
                  <Loader2 className="h-4 w-4 text-primary animate-spin" />
                  <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Агент анализирует запрос...
                </span>
              </div>
            )}

            {isProcessing && streamingEvents.length > 0 && !currentAnswer && (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/5 border border-primary/20">
                <Loader2 className="h-3 w-3 text-primary animate-spin" />
                <span className="text-xs text-primary font-medium">
                  Формирую ответ...
                </span>
                <div className="flex gap-1 ml-auto">
                  <div
                    className="w-1 h-1 rounded-full bg-primary animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <div
                    className="w-1 h-1 rounded-full bg-primary animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <div
                    className="w-1 h-1 rounded-full bg-primary animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
