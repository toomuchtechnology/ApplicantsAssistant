import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserMenu } from "../components/auth/UserMenu";

const mockUser = {
  fullName: "Иван Петров",
  email: "ivan@example.com",
  pictureUrl: null,
};

// Открывает дропдаун кликом по аватару
const openMenu = async () => {
  await userEvent.click(screen.getByRole("button"));
};

describe("UserMenu", () => {
  it("отображает инициал в аватаре без открытия меню", () => {
    render(<UserMenu user={mockUser} onLogout={vi.fn()} />);
    expect(screen.getByText("И")).toBeInTheDocument();
  });

  it('отображает "U" в аватаре если fullName отсутствует', () => {
    render(
      <UserMenu user={{ ...mockUser, fullName: null }} onLogout={vi.fn()} />,
    );
    expect(screen.getByText("U")).toBeInTheDocument();
  });

  it("отображает полное имя после открытия меню", async () => {
    render(<UserMenu user={mockUser} onLogout={vi.fn()} />);
    await openMenu();
    expect(screen.getByText("Иван Петров")).toBeInTheDocument();
  });

  it("отображает email после открытия меню", async () => {
    render(<UserMenu user={mockUser} onLogout={vi.fn()} />);
    await openMenu();
    expect(screen.getByText("ivan@example.com")).toBeInTheDocument();
  });

  it("отображает groupNumber после открытия меню", async () => {
    render(
      <UserMenu
        user={{ ...mockUser, groupNumber: "ИУ5-11" }}
        onLogout={vi.fn()}
      />,
    );
    await openMenu();
    expect(screen.getByText(/ИУ5-11/)).toBeInTheDocument();
  });

  it("не отображает строку группы если groupNumber не передан", async () => {
    render(<UserMenu user={mockUser} onLogout={vi.fn()} />);
    await openMenu();
    expect(screen.queryByText(/Группа/)).not.toBeInTheDocument();
  });

  it("вызывает onLogout при клике на Выйти", async () => {
    const onLogout = vi.fn();
    render(<UserMenu user={mockUser} onLogout={onLogout} />);
    await openMenu();
    await userEvent.click(screen.getByText("Выйти"));
    expect(onLogout).toHaveBeenCalledTimes(1);
  });
});
