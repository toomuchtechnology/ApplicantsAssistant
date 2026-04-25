// src/components/ui/rag-chat/ConnectionStatus.jsx
import React from "react";
import { Wifi, WifiOff, Loader2 } from "lucide-react";

export const ConnectionStatus = ({ isConnected }) => {
  return (
    <div
      className={`px-4 py-2 text-xs font-medium flex items-center justify-between border-b flex-shrink-0 z-10 ${
        isConnected
          ? "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800"
          : "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800"
      }`}
    >
      <div className="flex items-center gap-2">
        {isConnected ? (
          <>
            <div className="relative">
              <Wifi className="h-3.5 w-3.5" />
              <span className="absolute inset-0 animate-ping opacity-75">
                <Wifi className="h-3.5 w-3.5" />
              </span>
            </div>
            <span className="font-medium">WebSocket подключен</span>
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse ml-2" />
          </>
        ) : (
          <>
            <WifiOff className="h-3.5 w-3.5 animate-pulse" />
            <span className="font-medium">Подключение к WebSocket...</span>
          </>
        )}
      </div>

      {!isConnected && (
        <div className="flex items-center gap-1.5">
          <Loader2 className="h-3 w-3 animate-spin" />
          <span className="text-xs">Переподключение...</span>
        </div>
      )}
    </div>
  );
};
