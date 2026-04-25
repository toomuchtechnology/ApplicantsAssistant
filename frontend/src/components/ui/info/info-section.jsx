// src/components/ui/info.jsx
import { useEffect, useRef } from "react";
import {
  MessageSquare,
  Search,
  Database,
  Zap,
  Brain,
  Wifi,
  Clock,
  FileText,
  Users,
  Server,
} from "lucide-react";

// ── Scroll-reveal hook ────────────────────────────────────────────────────
const useReveal = () => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("revealed");
          obs.disconnect();
        }
      },
      { threshold: 0.08 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
};

// ── Shared keyframes injected once ───────────────────────────────────────
const Keyframes = () => (
  <style>{`
    .reveal { opacity: 0; transform: translateY(16px); transition: opacity 0.45s ease, transform 0.45s ease; }
    .reveal.revealed { opacity: 1; transform: translateY(0); }

    .stagger-grid > * { opacity: 0; transform: translateY(14px); }
    .stagger-grid.revealed > *:nth-child(1)  { animation: fadeUp 0.4s ease 0.05s forwards; }
    .stagger-grid.revealed > *:nth-child(2)  { animation: fadeUp 0.4s ease 0.10s forwards; }
    .stagger-grid.revealed > *:nth-child(3)  { animation: fadeUp 0.4s ease 0.15s forwards; }
    .stagger-grid.revealed > *:nth-child(4)  { animation: fadeUp 0.4s ease 0.20s forwards; }
    .stagger-grid.revealed > *:nth-child(5)  { animation: fadeUp 0.4s ease 0.25s forwards; }
    .stagger-grid.revealed > *:nth-child(6)  { animation: fadeUp 0.4s ease 0.30s forwards; }
    .stagger-grid.revealed > *:nth-child(7)  { animation: fadeUp 0.4s ease 0.35s forwards; }
    .stagger-grid.revealed > *:nth-child(8)  { animation: fadeUp 0.4s ease 0.40s forwards; }
    @keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }

    .feat-card { transition: box-shadow 0.2s ease, border-color 0.2s ease, transform 0.15s ease; }
    .feat-card:hover { box-shadow: 0 4px 16px -4px rgba(0,0,0,0.1); border-color: rgb(156 163 175); transform: translateY(-2px); }
    .dark .feat-card:hover { border-color: rgb(75 85 99); }
    .feat-card:hover .feat-icon { transform: scale(1.12); }
    .feat-icon { transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1); }

    .step-cell { transition: background 0.2s ease; }
    .step-cell:hover { background: hsl(var(--muted) / 0.5); }
    .step-cell:hover .step-pill { background: hsl(var(--primary) / 0.12); color: hsl(var(--primary)); }
    .step-pill { transition: background 0.2s ease, color 0.2s ease; }

    .cap-card { transition: box-shadow 0.2s ease, border-color 0.2s ease; }
    .cap-card:hover { box-shadow: 0 4px 16px -4px rgba(0,0,0,0.1); border-color: rgb(156 163 175); }
    .dark .cap-card:hover { border-color: rgb(75 85 99); }
    .cap-card:hover .cap-icon { background: hsl(var(--primary) / 0.08); }
    .cap-icon { transition: background 0.2s ease; }
    .cap-item { transition: color 0.15s ease; }
    .cap-item:hover { color: hsl(var(--foreground)); }
    .cap-item:hover .cap-dot { background: hsl(var(--primary) / 0.6); transform: scale(1.3); }
    .cap-dot { transition: background 0.15s ease, transform 0.15s ease; }
  `}</style>
);

// ── Components ────────────────────────────────────────────────────────────
const SectionLabel = ({ children }) => (
  <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground mb-4">
    {children}
  </p>
);

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="feat-card rounded-xl border border-border bg-card p-4 flex flex-col gap-3">
    <div className="feat-icon w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center flex-shrink-0">
      <Icon className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
    </div>
    <div>
      <p className="text-sm font-medium text-card-foreground mb-1">{title}</p>
      <p className="text-xs text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  </div>
);

const CapabilityCard = ({ icon: Icon, title, items }) => (
  <div className="cap-card rounded-xl border border-border bg-card overflow-hidden">
    <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border">
      <div className="cap-icon w-6 h-6 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
      <span className="text-sm font-medium text-card-foreground">{title}</span>
    </div>
    <ul className="px-4 py-3 flex flex-col gap-2">
      {items.map((item, i) => (
        <li
          key={i}
          className="cap-item flex items-start gap-2 text-xs text-muted-foreground leading-relaxed"
        >
          <span className="cap-dot mt-1.5 w-1.5 h-1.5 rounded-full bg-border flex-shrink-0" />
          {item}
        </li>
      ))}
    </ul>
  </div>
);

// ── Page ──────────────────────────────────────────────────────────────────
export const InfoSection = () => {
  const headerRef = useReveal();
  const featRef = useReveal();
  const stepsRef = useReveal();
  const capsRef = useReveal();

  const features = [
    {
      icon: MessageSquare,
      title: "Чат с ИИ",
      description:
        "Интерактивное общение с AI-ассистентом, который понимает контекст и отвечает на сложные вопросы",
    },
    {
      icon: Search,
      title: "Поиск с источниками",
      description:
        "Каждый ответ сопровождается ссылками на источники информации с указанием релевантности",
    },
    {
      icon: Database,
      title: "База знаний",
      description:
        "Агент выполняет генерацию ответов на основе документов, загруженных в базу знаний системы",
    },
    {
      icon: Brain,
      title: "RAG-технология",
      description: "Передовая технология поиска и генерации ответов",
    },
    {
      icon: Zap,
      title: "Реальное время",
      description:
        "Мгновенные ответы с отображением процесса обработки запроса",
    },
    {
      icon: Wifi,
      title: "WebSocket связь",
      description:
        "Постоянное соединение для мгновенной передачи сообщений и событий",
    },
    {
      icon: Clock,
      title: "История диалогов",
      description:
        "Сохранение всех бесед с возможностью продолжить в любой момент",
    },
    {
      icon: FileText,
      title: "Множество сессий",
      description: "Неограниченное количество чатов для разных тем",
    },
  ];

  const steps = [
    { num: "1", title: "Запрос", desc: "Вы задаёте вопрос в чате" },
    { num: "2", title: "Поиск", desc: "Агент ищет информацию в документах" },
    { num: "3", title: "Анализ", desc: "LLM анализирует найденные данные" },
    { num: "4", title: "Ответ", desc: "Вы получаете ответ с источниками" },
  ];

  const capabilities = [
    {
      icon: Search,
      title: "Поиск информации",
      items: [
        "Гибридный поиск по документам",
        "Семантический векторный поиск",
        "Ранжирование результатов по релевантности",
        "Извлечение ключевых фрагментов",
      ],
    },
    {
      icon: Brain,
      title: "Обработка ответов",
      items: [
        "Генерация точных ответов на основе найденных данных",
        "Цитирование источников в ответах",
        "Многошаговое рассуждение агента",
        "Автоматическое уточнение запросов",
      ],
    },
    {
      icon: Users,
      title: "Пользовательский опыт",
      items: [
        "Визуализация процесса обработки запроса",
        "Прозрачность выполнения инструментов",
        "Сохранение истории всех диалогов",
        "Управление множеством чатов",
      ],
    },
    {
      icon: Server,
      title: "Технические особенности",
      items: [
        "WebSocket соединение в реальном времени",
        "Асинхронная обработка запросов",
        "Масштабируемая архитектура",
        "Безопасная аутентификация",
      ],
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-950">
      <Keyframes />
      <div className="container mx-auto px-4 py-10 max-w-6xl">
        {/* Header */}
        <div ref={headerRef} className="reveal mb-10">
          <h1 className="text-2xl font-bold text-foreground mb-1">Справка</h1>
          <p className="text-sm text-muted-foreground">
            Задавайте вопросы, получайте точные ответы с источниками и
            наблюдайте за процессом обработки в реальном времени
          </p>
        </div>

        {/* Features — staggered children */}
        <div className="mb-10">
          <div ref={featRef} className="reveal mb-4">
            <SectionLabel>Возможности</SectionLabel>
          </div>
          <div
            ref={useRevealGrid()}
            className="stagger-grid grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
          >
            {features.map((f, i) => (
              <FeatureCard key={i} {...f} />
            ))}
          </div>
        </div>

        {/* Steps */}
        <div className="mb-10">
          <div ref={stepsRef} className="reveal">
            <SectionLabel>Процесс обработки запросов</SectionLabel>
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border">
                {steps.map((step) => (
                  <div
                    key={step.num}
                    className="step-cell px-5 py-5 text-center"
                  >
                    <span className="step-pill inline-block text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 rounded-full px-2.5 py-0.5 mb-3">
                      {step.num}
                    </span>
                    <p className="text-sm font-medium text-card-foreground mb-1">
                      {step.title}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Capabilities */}
        <div>
          <div ref={capsRef} className="reveal mb-4">
            <SectionLabel>Детальные возможности</SectionLabel>
          </div>
          <div
            ref={useRevealGrid()}
            className="stagger-grid grid grid-cols-1 md:grid-cols-2 gap-3"
          >
            {capabilities.map((cap, i) => (
              <CapabilityCard key={i} {...cap} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Grid stagger variant of the hook (same logic, separate ref) ───────────
function useRevealGrid() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("revealed");
          obs.disconnect();
        }
      },
      { threshold: 0.06 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}
