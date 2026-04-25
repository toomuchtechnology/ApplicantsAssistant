import { renderHook, act } from "@testing-library/react";
import { useNavigation } from "../components/header/useNavigation";

// Мокируем react-router-dom
const mockNavigate = vi.fn();
let mockPathname = "/";

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: mockPathname }),
}));

beforeEach(() => {
  mockNavigate.mockClear();
  mockPathname = "/";
});

describe("useNavigation — isActive", () => {
  it("возвращает true если pathname совпадает с path", () => {
    mockPathname = "/info";
    const { result } = renderHook(() => useNavigation());
    expect(result.current.isActive("/info")).toBe(true);
  });

  it("возвращает false если pathname не совпадает", () => {
    mockPathname = "/profile";
    const { result } = renderHook(() => useNavigation());
    expect(result.current.isActive("/info")).toBe(false);
  });

  it("считает /chats активным на странице /chats", () => {
    mockPathname = "/chats";
    const { result } = renderHook(() => useNavigation());
    expect(result.current.isActive("/chats")).toBe(true);
  });

  it("считает /chats активным внутри /rag-chat/:id", () => {
    mockPathname = "/rag-chat/123";
    const { result } = renderHook(() => useNavigation());
    expect(result.current.isActive("/chats")).toBe(true);
  });

  it("считает /chats активным на /rag-chat без id", () => {
    mockPathname = "/rag-chat";
    const { result } = renderHook(() => useNavigation());
    expect(result.current.isActive("/chats")).toBe(true);
  });
});

describe("useNavigation — isInChat", () => {
  it("возвращает true внутри конкретного чата", () => {
    mockPathname = "/rag-chat/abc-123";
    const { result } = renderHook(() => useNavigation());
    expect(result.current.isInChat).toBe(true);
  });

  it("возвращает true на /rag-chat", () => {
    mockPathname = "/rag-chat";
    const { result } = renderHook(() => useNavigation());
    expect(result.current.isInChat).toBe(true);
  });

  it("возвращает false на других страницах", () => {
    mockPathname = "/chats";
    const { result } = renderHook(() => useNavigation());
    expect(result.current.isInChat).toBe(false);
  });
});

describe("useNavigation — handleNavigate", () => {
  it("вызывает navigate с нужным path", () => {
    const { result } = renderHook(() => useNavigation());
    act(() => result.current.handleNavigate("/profile"));
    expect(mockNavigate).toHaveBeenCalledWith("/profile");
  });

  it("вызывает onNavigate колбэк после навигации", () => {
    const onNavigate = vi.fn();
    const { result } = renderHook(() => useNavigation(onNavigate));
    act(() => result.current.handleNavigate("/info"));
    expect(onNavigate).toHaveBeenCalledTimes(1);
  });

  it("не падает если onNavigate не передан", () => {
    const { result } = renderHook(() => useNavigation());
    expect(() =>
      act(() => result.current.handleNavigate("/info")),
    ).not.toThrow();
  });
});
