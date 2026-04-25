import { Sparkles, MessagesSquare, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

// ── Animated "no chats" empty state ──────────────────────────────────────────
export const EmptyChatsState = ({ onNewChat, isCreating }) => (
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
