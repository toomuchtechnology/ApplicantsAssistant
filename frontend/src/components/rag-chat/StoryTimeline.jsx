// src/components/ui/rag-chat/StoryTimeline.jsx
import React from "react";
import { Clock } from "lucide-react";
import { StoryCard } from "./StoryCard";

export const StoryTimeline = ({ events, isProcessing }) => {
  return (
    <div className="p-3 space-y-2">
      {events.map((event) => (
        <div
          key={event.id}
          className="animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          <StoryCard card={event} />
        </div>
      ))}
      {isProcessing && events.length > 0 && (
        <div className="flex items-center justify-center gap-2 py-2 text-xs text-gray-500">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span>Агент продолжает обработку...</span>
        </div>
      )}
    </div>
  );
};
