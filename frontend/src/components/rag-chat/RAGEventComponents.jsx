// components/rag-chat/RAGEventComponents.jsx
import { memo } from "react";
import { motion } from "framer-motion";
import {
  Loader2,
  Brain,
  Wrench,
  CheckCircle2,
  XCircle,
  Search,
  FileSearch,
  Sparkles,
  Clock,
  Zap,
  ArrowRight,
  Database,
  Bot,
} from "lucide-react";
import { SimpleMarkdownContent } from "../fixed-markdown-content";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const ThinkingIndicator = memo(({ content }) => (
  <motion.div
    variants={fadeInUp}
    initial="initial"
    animate="animate"
    className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-800"
  >
    <div className="relative">
      <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-20"></div>
      <Loader2 className="h-5 w-5 animate-spin text-blue-600 dark:text-blue-400" />
    </div>
    <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
      {content}
    </span>
  </motion.div>
));

ThinkingIndicator.displayName = "ThinkingIndicator";

export const IterationStartEvent = memo(({ data }) => (
  <motion.div
    variants={fadeInUp}
    initial="initial"
    animate="animate"
    className="group relative p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border border-purple-200 dark:border-purple-800 overflow-hidden"
  >
    <div className="absolute top-0 right-0 w-20 h-20 bg-purple-400/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
    <div className="relative flex items-start gap-3">
      <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/50">
        <Zap className="h-4 w-4 text-purple-600 dark:text-purple-400" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold text-purple-700 dark:text-purple-300 uppercase tracking-wider">
            Итерация начата
          </span>
          <span className="text-xs text-purple-600 dark:text-purple-400">
            Максимум: {data?.max_iterations}
          </span>
        </div>
        <p className="text-sm text-purple-900 dark:text-purple-100">
          Запрос: <span className="font-medium">"{data?.query}"</span>
        </p>
      </div>
    </div>
  </motion.div>
));

IterationStartEvent.displayName = "IterationStartEvent";

export const LLMResponseEvent = memo(({ data }) => (
  <motion.div
    variants={fadeInUp}
    initial="initial"
    animate="animate"
    className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-200 dark:border-emerald-800"
  >
    <div className="flex items-start gap-3">
      <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/50">
        <Brain className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
            Решение LLM
          </span>
        </div>
        <p className="text-sm text-emerald-900 dark:text-emerald-100">
          {data?.has_tool_calls
            ? `🔧 Вызов ${data.tool_call_count} инструмента(ов)...`
            : "💬 Генерация финального ответа..."}
        </p>
        {data?.has_tool_calls && (
          <div className="mt-2 flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
            <ArrowRight className="h-3 w-3" />
            <span>
              Агент решил использовать инструменты для поиска информации
            </span>
          </div>
        )}
      </div>
    </div>
  </motion.div>
));

LLMResponseEvent.displayName = "LLMResponseEvent";

export const ToolCallEvent = memo(({ data }) => (
  <motion.div
    variants={fadeInUp}
    initial="initial"
    animate="animate"
    className="p-4 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border border-orange-200 dark:border-orange-800"
  >
    <div className="flex items-start gap-3">
      <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/50 animate-pulse">
        <Wrench className="h-4 w-4 text-orange-600 dark:text-orange-400" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold text-orange-700 dark:text-orange-300 uppercase tracking-wider">
            Вызов инструмента
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-orange-200 dark:bg-orange-800 text-orange-800 dark:text-orange-200 font-mono">
            {data?.tool_name}
          </span>
        </div>
        <details className="mt-2">
          <summary className="text-xs text-orange-600 dark:text-orange-400 cursor-pointer hover:text-orange-700">
            Показать аргументы
          </summary>
          <pre className="mt-2 p-2 rounded-lg bg-orange-100/50 dark:bg-orange-900/30 text-xs overflow-x-auto">
            {JSON.stringify(data?.arguments, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  </motion.div>
));

ToolCallEvent.displayName = "ToolCallEvent";

export const ToolResultEvent = memo(({ data }) => (
  <motion.div
    variants={fadeInUp}
    initial="initial"
    animate="animate"
    className="p-4 rounded-xl bg-gradient-to-r from-green-50 to-lime-50 dark:from-green-950/20 dark:to-lime-950/20 border border-green-200 dark:border-green-800"
  >
    <div className="flex items-start gap-3">
      <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/50">
        {data?.success ? (
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
        ) : (
          <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold text-green-700 dark:text-green-300 uppercase tracking-wider">
            Результат инструмента
          </span>
          <span className="text-xs text-green-600 dark:text-green-400">
            {data?.tool_name}
          </span>
          {data?.result_length && (
            <span className="text-xs text-green-600 dark:text-green-400">
              • {Math.ceil(data.result_length / 1000)}KB
            </span>
          )}
        </div>
        <details className="mt-2">
          <summary className="text-xs text-green-600 dark:text-green-400 cursor-pointer hover:text-green-700">
            Просмотр результатов ({data?.result_length || 0} символов)
          </summary>
          <div className="mt-2 p-3 rounded-lg bg-green-100/50 dark:bg-green-900/30">
            <p className="text-xs text-green-900 dark:text-green-100 whitespace-pre-wrap">
              {data?.result_preview}
            </p>
          </div>
        </details>
      </div>
    </div>
  </motion.div>
));

ToolResultEvent.displayName = "ToolResultEvent";

export const AnswerEvent = memo(({ content }) => (
  <motion.div
    variants={fadeInUp}
    initial="initial"
    animate="animate"
    className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 border-2 border-blue-200 dark:border-blue-800 shadow-xl"
  >
    <div className="flex items-center gap-2 mb-4">
      <div className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse">
        <Sparkles className="h-4 w-4 text-white" />
      </div>
      <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Финальный ответ
      </h3>
    </div>
    <div className="prose prose-sm dark:prose-invert max-w-none">
      <SimpleMarkdownContent content={content} />
    </div>
  </motion.div>
));

AnswerEvent.displayName = "AnswerEvent";

export const ErrorEvent = memo(({ content }) => (
  <motion.div
    variants={fadeInUp}
    initial="initial"
    animate="animate"
    className="p-4 rounded-xl bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20 border border-red-200 dark:border-red-800"
  >
    <div className="flex items-start gap-3">
      <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/50">
        <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
      </div>
      <div className="flex-1">
        <span className="text-xs font-semibold text-red-700 dark:text-red-300 uppercase tracking-wider">
          Ошибка
        </span>
        <p className="mt-1 text-sm text-red-900 dark:text-red-100">{content}</p>
      </div>
    </div>
  </motion.div>
));

ErrorEvent.displayName = "ErrorEvent";

export const CompleteEvent = memo(({ data }) => (
  <motion.div
    variants={fadeInUp}
    initial="initial"
    animate="animate"
    className="mt-4 p-3 rounded-lg bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/50 dark:to-slate-900/50 border border-gray-200 dark:border-gray-700 text-center"
  >
    <div className="flex items-center justify-center gap-2">
      <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
      <span className="text-sm text-gray-700 dark:text-gray-300">
        {data?.status === "success" ? "Запрос успешно выполнен" : "Завершено"}
      </span>
    </div>
  </motion.div>
));

CompleteEvent.displayName = "CompleteEvent";
