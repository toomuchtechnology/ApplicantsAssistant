// src/components/ui/rag-chat/FinalMessage.jsx
import React, { useState } from "react";
import { Bot, Sparkles, ChevronUp, ChevronDown } from "lucide-react";
import { StoryCard } from "./StoryCard";
import { SimpleMarkdownContent } from "../fixed-markdown-content";

export const FinalMessage = ({ message }) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex-shrink-0">
        <div className="p-2 rounded-full bg-primary/10">
          <Bot className="h-5 w-5 text-primary" />
        </div>
      </div>

      <div className="flex-1 rounded-xl bg-card border border-border shadow-sm overflow-hidden">
        {/* Storyline Header */}
        {message.storyEvents && message.storyEvents.length > 0 && (
          <div
            onClick={() => setExpanded(!expanded)}
            className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 cursor-pointer hover:from-primary/10 hover:to-primary/15 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="font-semibold text-sm">История обработки</span>
                <span className="text-xs text-gray-500">
                  ({message.storyEvents.length} шагов)
                </span>
              </div>
              {expanded ? (
                <ChevronUp className="h-4 w-4 text-gray-500 transition-transform" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500 transition-transform" />
              )}
            </div>
          </div>
        )}

        {/* Storyline Content */}
        {expanded && message.storyEvents && message.storyEvents.length > 0 && (
          <div className="p-4 space-y-2 border-t border-border">
            {message.storyEvents.map((event, idx) => (
              <div
                key={event.id}
                className="animate-in fade-in slide-in-from-bottom-2 duration-300"
                style={{ animationDelay: `${idx * 30}ms` }}
              >
                <StoryCard card={event} />
              </div>
            ))}
          </div>
        )}

        {/* Final Answer */}
        <div className="p-4 border-t border-border">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <SimpleMarkdownContent content={message.content} />
          </div>
          <div className="flex items-center gap-2 mt-3 pt-2 border-t border-border/50">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <p className="text-xs text-muted-foreground">
              {new Date(message.timestamp).toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
