import { render, screen } from "@testing-library/react";
import { ProfileCard } from "../components/profile/ProfileCard";

// Avatar компоненты используют img — мокируем чтобы не падало в jsdom
vi.mock("../avatar", () => ({
  Avatar: ({ children }) => <div>{children}</div>,
  AvatarImage: ({ alt }) => <img alt={alt} />,
  AvatarFallback: ({ children }) => <span>{children}</span>,
}));

const mockUser = {
  id: "user-123",
  firstName: "Иван",
  lastName: "Петров",
  fullName: "Иван Петров",
  email: "ivan@example.com",
  locale: "ru",
  createdAt: "2024-01-15T10:00:00Z",
  pictureUrl: null,
};

describe("ProfileCard", () => {
  it("отображает полное имя пользователя", () => {
    render(<ProfileCard user={mockUser} />);
    expect(screen.getByText("Иван Петров")).toBeInTheDocument();
  });

  it("отображает id пользователя", () => {
    render(<ProfileCard user={mockUser} />);
    expect(screen.getByText("user-123")).toBeInTheDocument();
  });

  it("отображает email", () => {
    render(<ProfileCard user={mockUser} />);
    expect(screen.getByText("ivan@example.com")).toBeInTheDocument();
  });

  it("отображает имя и фамилию отдельно", () => {
    render(<ProfileCard user={mockUser} />);
    expect(screen.getByText("Иван")).toBeInTheDocument();
    expect(screen.getByText("Петров")).toBeInTheDocument();
  });

  it('отображает "Русский" для locale=ru', () => {
    render(<ProfileCard user={mockUser} />);
    expect(screen.getByText("Русский")).toBeInTheDocument();
  });

  it('отображает "English" для locale=en', () => {
    render(<ProfileCard user={{ ...mockUser, locale: "en" }} />);
    expect(screen.getByText("English")).toBeInTheDocument();
  });

  it("отображает locale как есть если он неизвестен", () => {
    render(<ProfileCard user={{ ...mockUser, locale: "de" }} />);
    expect(screen.getByText("de")).toBeInTheDocument();
  });

  it('отображает "Пользователь" если fullName и имя/фамилия отсутствуют', () => {
    render(
      <ProfileCard
        user={{ ...mockUser, fullName: null, firstName: null, lastName: null }}
      />,
    );
    expect(screen.getByText("Пользователь")).toBeInTheDocument();
  });

  it("отображает инициалы в аватаре если pictureUrl отсутствует", () => {
    render(<ProfileCard user={mockUser} />);
    expect(screen.getByText("ИП")).toBeInTheDocument();
  });

  it("отображает дату регистрации", () => {
    render(<ProfileCard user={mockUser} />);
    expect(screen.getByText(/2024/)).toBeInTheDocument();
  });
});
