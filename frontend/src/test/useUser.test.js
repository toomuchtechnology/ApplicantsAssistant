import { renderHook, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { useUser } from "../components/profile/useUser";

const mockUser = {
  id: "user-1",
  firstName: "Иван",
  lastName: "Петров",
  email: "ivan@example.com",
  locale: "ru",
  createdAt: "2024-01-15T10:00:00Z",
};

const server = setupServer(
  http.get("http://localhost:8081/api/users/me", () => {
    return HttpResponse.json(mockUser);
  }),
);

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  localStorage.clear();
});
afterAll(() => server.close());

describe("useUser", () => {
  beforeEach(() => {
    localStorage.setItem("jwt_token", "valid.test.token");
  });

  it("начинает с isLoading=true", () => {
    const { result } = renderHook(() => useUser());
    expect(result.current.isLoading).toBe(true);
  });

  it("загружает данные пользователя", async () => {
    const { result } = renderHook(() => useUser());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.error).toBeNull();
  });

  it("устанавливает error при ошибке сервера", async () => {
    server.use(
      http.get("http://localhost:8081/api/users/me", () => {
        return HttpResponse.json({ message: "Server error" }, { status: 500 });
      }),
    );

    const { result } = renderHook(() => useUser());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.user).toBeNull();
    expect(result.current.error).toBeTruthy();
  });

  it("устанавливает error при 401", async () => {
    server.use(
      http.get("http://localhost:8081/api/users/me", () => {
        return HttpResponse.json({}, { status: 401 });
      }),
    );

    const { result } = renderHook(() => useUser());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toMatch(/session expired/i);
  });

  it("выбрасывает ошибку аутентификации если токена нет", async () => {
    localStorage.removeItem("jwt_token");

    const { result } = renderHook(() => useUser());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toMatch(/authentication required/i);
  });

  it("reload перезагружает данные", async () => {
    const { result } = renderHook(() => useUser());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // Обновляем мок
    const updatedUser = { ...mockUser, firstName: "Пётр" };
    server.use(
      http.get("http://localhost:8081/api/users/me", () => {
        return HttpResponse.json(updatedUser);
      }),
    );

    await result.current.reload();

    await waitFor(() => expect(result.current.user?.firstName).toBe("Пётр"));
  });
});
