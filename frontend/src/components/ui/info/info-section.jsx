// src/components/ui/info.jsx
import { Card, CardContent, CardHeader, CardTitle } from "../card";
import {
  MessageSquare,
  Search,
  Database,
  Zap,
  Brain,
  Wifi,
  Clock,
  FileText,
  Sparkles,
  Shield,
  Link2,
  Cpu,
  Users,
  Server,
  BarChart3,
  CheckCircle2,
} from "lucide-react";

export const InfoSection = () => {
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

  const capabilities = [
    {
      title: "Поиск информации",
      icon: Search,
      items: [
        "Гибридный поиск по документам",
        "Семантический векторный поиск",
        "Ранжирование результатов по релевантности",
        "Извлечение ключевых фрагментов",
      ],
    },
    {
      title: "Обработка ответов",
      icon: Brain,
      items: [
        "Генерация точных ответов на основе найденных данных",
        "Цитирование источников в ответах",
        "Многошаговое рассуждение агента",
        "Автоматическое уточнение запросов",
      ],
    },
    {
      title: "Пользовательский опыт",
      icon: Users,
      items: [
        "Визуализация процесса обработки запроса",
        "Прозрачность выполнения инструментов",
        "Сохранение истории всех диалогов",
        "Управление множеством чатов",
      ],
    },
    {
      title: "Технические особенности",
      icon: Server,
      items: [
        "WebSocket соединение в реальном времени",
        "Асинхронная обработка запросов",
        "Масштабируемая архитектура",
        "Безопасная аутентификация",
      ],
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Задавайте вопросы, получайте точные ответы с источниками и
            наблюдайте за процессом обработки в реальном времени
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <CardHeader className="space-y-3">
                  <div className="p-2.5 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl w-fit group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* How it works */}
        <Card className="overflow-hidden">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              Процесс обработки запросов
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold mx-auto">
                  1
                </div>
                <h3 className="font-semibold">Запрос</h3>
                <p className="text-sm text-muted-foreground">
                  Вы задаете вопрос в чате
                </p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold mx-auto">
                  2
                </div>
                <h3 className="font-semibold">Поиск</h3>
                <p className="text-sm text-muted-foreground">
                  Агент ищет информацию в документах
                </p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold mx-auto">
                  3
                </div>
                <h3 className="font-semibold">Анализ</h3>
                <p className="text-sm text-muted-foreground">
                  LLM анализирует найденные данные
                </p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold mx-auto">
                  4
                </div>
                <h3 className="font-semibold">Ответ</h3>
                <p className="text-sm text-muted-foreground">
                  Вы получаете ответ с источниками
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Capabilities - Enhanced with Icons & Effects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {capabilities.map((cap, index) => {
            const Icon = cap.icon;
            return (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-primary/50 overflow-hidden relative"
              >
                {/* Background gradient effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <CardHeader className="pb-3 relative">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300">
                      {cap.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <ul className="space-y-3">
                    {cap.items.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 text-sm text-muted-foreground group/item"
                      >
                        <CheckCircle2 className="h-4 w-4 text-primary/70 mt-0.5 flex-shrink-0 transition-all duration-200 group-hover/item:text-primary group-hover/item:scale-110" />
                        <span className="group-hover/item:text-foreground transition-colors duration-200">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
