import { eventToStoryCard } from "../components/rag-chat/useStreamingEvents";

describe("eventToStoryCard", () => {
  describe("iteration_start", () => {
    it("маппит событие в карточку с нужными полями", () => {
      const card = eventToStoryCard({
        type: "iteration_start",
        data: { query: "тестовый запрос", max_iterations: 5 },
      });
      expect(card.type).toBe("iteration");
      expect(card.color).toBe("purple");
      expect(card.icon).toBe("zap");
      expect(card.badge).toContain("5");
      expect(card.details.query).toBe("тестовый запрос");
    });
  });

  describe("llm_response", () => {
    it("отображает решение с инструментами", () => {
      const card = eventToStoryCard({
        type: "llm_response",
        data: { has_tool_calls: true, tool_call_count: 2 },
      });
      expect(card.icon).toBe("wrench");
      expect(card.description).toContain("2");
    });

    it("отображает генерацию финального ответа", () => {
      const card = eventToStoryCard({
        type: "llm_response",
        data: { has_tool_calls: false },
      });
      expect(card.icon).toBe("brain");
    });
  });

  describe("tool_call", () => {
    it("маппит событие с названием инструмента", () => {
      const card = eventToStoryCard({
        type: "tool_call",
        data: { tool_name: "search_documents", arguments: { query: "test" } },
      });
      expect(card.type).toBe("tool_call");
      expect(card.badge).toBe("search_documents");
      expect(card.details).toEqual({ query: "test" });
      expect(card.color).toBe("orange");
    });
  });

  describe("tool_result", () => {
    it("маппит успешный результат", () => {
      const card = eventToStoryCard({
        type: "tool_result",
        data: {
          success: true,
          result_preview: "найденный текст",
          result_length: 2048,
        },
      });
      expect(card.color).toBe("green");
      expect(card.icon).toBe("check");
      expect(card.details).toBe("найденный текст");
    });

    it("маппит неуспешный результат", () => {
      const card = eventToStoryCard({
        type: "tool_result",
        data: { success: false, result_preview: "" },
      });
      expect(card.color).toBe("red");
      expect(card.icon).toBe("alert");
    });

    it("парсит JSON-массив документов из result_preview", () => {
      const docs = [
        { document: 1, source: "file.pdf", content: "текст", score: 0.95 },
      ];
      const card = eventToStoryCard({
        type: "tool_result",
        data: { success: true, result_preview: JSON.stringify(docs) },
      });
      expect(card.documents).toHaveLength(1);
      expect(card.details).toBe("Найдено 1 документов");
    });

    it("не падает если result_preview не является JSON", () => {
      expect(() =>
        eventToStoryCard({
          type: "tool_result",
          data: { success: true, result_preview: "просто текст" },
        }),
      ).not.toThrow();
    });
  });

  describe("complete", () => {
    it("маппит успешное завершение", () => {
      const card = eventToStoryCard({
        type: "complete",
        data: { status: "success" },
      });
      expect(card.type).toBe("complete");
      expect(card.color).toBe("blue");
      expect(card.description).toContain("успешно");
    });
  });

  describe("error", () => {
    it("маппит ошибку с текстом", () => {
      const card = eventToStoryCard({
        type: "error",
        content: "Что-то пошло не так",
      });
      expect(card.type).toBe("error");
      expect(card.color).toBe("red");
      expect(card.description).toBe("Что-то пошло не так");
    });

    it("использует дефолтный текст если content пустой", () => {
      const card = eventToStoryCard({ type: "error" });
      expect(card.description).toBeTruthy();
    });
  });

  describe("неизвестный тип", () => {
    it("возвращает null", () => {
      expect(eventToStoryCard({ type: "unknown_event" })).toBeNull();
    });
  });

  describe("уникальность id", () => {
    it("генерирует уникальные id для одинаковых событий", () => {
      const a = eventToStoryCard({ type: "complete", data: {} });
      const b = eventToStoryCard({ type: "complete", data: {} });
      expect(a.id).not.toBe(b.id);
    });
  });
});
