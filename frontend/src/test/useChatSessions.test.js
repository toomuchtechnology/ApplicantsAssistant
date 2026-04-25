import { renderHook, waitFor, act } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { useChatSessions } from "../components/rag-chat/useChatSessions";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

// Мокируем window.confirm
window.confirm = vi.fn(() => true);

const mockSessions = [
  {
    id: "s1",
    title: "Чат про поступление",
    messageCount: 5,
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-11T10:00:00Z",
  },
  {
    id: "s2",
    title: "Вопросы про общежитие",
    messageCount: 3,
    createdAt: "2024-01-12T10:00:00Z",
    updatedAt: "2024-01-13T10:00:00Z",
  },
];

const server = setupServer(
  http.get("http://localhost:8081/api/chat/sessions", () => {
    return HttpResponse.json(mockSessions);
  }),
  http.post("http://localhost:8081/api/chat/sessions", () => {
    return HttpResponse.json({
      id: "s3",
      title: "New Chat",
      messageCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }),
  http.delete("http://localhost:8081/api/chat/sessions/:id", () => {
    return new HttpResponse(null, { status: 204 });
  }),
  http.put("http://localhost:8081/api/chat/sessions/:id", () => {
    return HttpResponse.json({});
  }),
);

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  mockNavigate.mockClear();
  localStorage.clear();
});
afterAll(() => server.close());

const renderSessions = (overrides = {}) =>
  renderHook(() =>
    useChatSessions({
      isAuthenticated: true,
      authLoading: false,
      ...overrides,
    }),
  );

describe("useChatSessions", () => {
  it("не загружает сессии если не аутентифицирован", async () => {
    const { result } = renderSessions({ isAuthenticated: false });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.sessions).toHaveLength(0);
  });

  it("не загружает сессии пока authLoading=true", () => {
    const { result } = renderSessions({ authLoading: true });
    expect(result.current.sessions).toHaveLength(0);
  });

  it("загружает список сессий", async () => {
    const { result } = renderSessions();
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.sessions).toHaveLength(2);
    expect(result.current.sessions[0].title).toBe("Чат про поступление");
  });

  it("handleNewChat создаёт сессию и редиректит", async () => {
    const { result } = renderSessions();
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(() => result.current.handleNewChat());

    expect(result.current.sessions).toHaveLength(3);
    expect(mockNavigate).toHaveBeenCalledWith("/rag-chat/s3");
  });

  it("handleDelete удаляет сессию из списка после подтверждения", async () => {
    const { result } = renderSessions();
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(() => result.current.handleDelete("s1"));

    expect(result.current.sessions).toHaveLength(1);
    expect(result.current.sessions[0].id).toBe("s2");
  });

  it("handleDelete не удаляет если пользователь отменил", async () => {
    window.confirm.mockReturnValueOnce(false);
    const { result } = renderSessions();
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(() => result.current.handleDelete("s1"));

    expect(result.current.sessions).toHaveLength(2);
  });

  it("handleRename обновляет title в списке", async () => {
    const { result } = renderSessions();
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(() => result.current.handleRename("s1", "Новое название"));

    const renamed = result.current.sessions.find((s) => s.id === "s1");
    expect(renamed.title).toBe("Новое название");
  });

  it("устанавливает deletingId во время удаления", async () => {
    let resolveFn;
    server.use(
      http.delete(
        "http://localhost:8081/api/chat/sessions/:id",
        () =>
          new Promise((resolve) => {
            resolveFn = resolve;
          }),
      ),
    );

    const { result } = renderSessions();
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.handleDelete("s1");
    });

    await waitFor(() => expect(result.current.deletingId).toBe("s1"));

    await act(() => resolveFn(new HttpResponse(null, { status: 204 })));

    await waitFor(() => expect(result.current.deletingId).toBeNull());
  });
});
