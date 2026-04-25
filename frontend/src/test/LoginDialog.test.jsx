import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("@react-oauth/google", () => ({
  GoogleLogin: ({ onSuccess, onError }) => (
    <div>
      <button onClick={() => onSuccess({ credential: "mock-token" })}>
        Войти через Google
      </button>
      <button onClick={() => onError()}>Симулировать ошибку</button>
    </div>
  ),
}));

const { LoginDialog } = await import("../components/auth/LoginDialog");

describe("LoginDialog", () => {
  it("не рендерится когда open=false", () => {
    render(
      <LoginDialog
        open={false}
        onOpenChange={vi.fn()}
        onSuccess={vi.fn()}
        onError={vi.fn()}
      />,
    );
    expect(screen.queryByText("Вход в систему")).not.toBeInTheDocument();
  });

  it("рендерится когда open=true", () => {
    render(
      <LoginDialog
        open={true}
        onOpenChange={vi.fn()}
        onSuccess={vi.fn()}
        onError={vi.fn()}
      />,
    );
    expect(screen.getByText("Вход в систему")).toBeInTheDocument();
  });

  it("отображает описание про Google аккаунт", () => {
    render(
      <LoginDialog
        open={true}
        onOpenChange={vi.fn()}
        onSuccess={vi.fn()}
        onError={vi.fn()}
      />,
    );
    expect(
      screen.getByText("Войдите через ваш Google аккаунт"),
    ).toBeInTheDocument();
  });

  it("вызывает onSuccess с токеном при успешном входе", async () => {
    const onSuccess = vi.fn();
    render(
      <LoginDialog
        open={true}
        onOpenChange={vi.fn()}
        onSuccess={onSuccess}
        onError={vi.fn()}
      />,
    );
    await userEvent.click(screen.getByText("Войти через Google"));
    expect(onSuccess).toHaveBeenCalledWith({ credential: "mock-token" });
  });

  it("вызывает onError при ошибке Google", async () => {
    const onError = vi.fn();
    render(
      <LoginDialog
        open={true}
        onOpenChange={vi.fn()}
        onSuccess={vi.fn()}
        onError={onError}
      />,
    );
    await userEvent.click(screen.getByText("Симулировать ошибку"));
    expect(onError).toHaveBeenCalledTimes(1);
  });
});
