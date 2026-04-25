import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Info } from "lucide-react";

// vi.mock поднимается наверх автоматически (hoisting) — как в Jest
vi.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, variant, ...props }) => (
    <button onClick={onClick} data-variant={variant} {...props}>
      {children}
    </button>
  ),
}));

// Импорт компонента — после мока
const { NavButton } = await import("../components/header/NavButton");

const infoItem = { id: "info", label: "Справка", icon: Info, path: "/info" };
const chatsItem = { id: "chats", label: "Чаты", icon: Info, path: "/chats" };

describe("NavButton — desktop вариант", () => {
  it("отображает label", () => {
    render(
      <NavButton
        item={infoItem}
        active={false}
        isInChat={false}
        onClick={vi.fn()}
      />,
    );
    expect(screen.getByText("Справка")).toBeInTheDocument();
  });

  it("использует variant=default когда активен", () => {
    render(
      <NavButton
        item={infoItem}
        active={true}
        isInChat={false}
        onClick={vi.fn()}
      />,
    );
    expect(screen.getByRole("button")).toHaveAttribute(
      "data-variant",
      "default",
    );
  });

  it("использует variant=ghost когда неактивен", () => {
    render(
      <NavButton
        item={infoItem}
        active={false}
        isInChat={false}
        onClick={vi.fn()}
      />,
    );
    expect(screen.getByRole("button")).toHaveAttribute("data-variant", "ghost");
  });

  it("вызывает onClick при клике", async () => {
    const onClick = vi.fn();
    render(
      <NavButton
        item={infoItem}
        active={false}
        isInChat={false}
        onClick={onClick}
      />,
    );
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("показывает badge-точку для chats когда пользователь в чате", () => {
    const { container } = render(
      <NavButton
        item={chatsItem}
        active={true}
        isInChat={true}
        onClick={vi.fn()}
      />,
    );
    expect(container.querySelector(".bg-blue-500")).toBeInTheDocument();
  });

  it("не показывает badge-точку для других пунктов меню", () => {
    const { container } = render(
      <NavButton
        item={infoItem}
        active={false}
        isInChat={true}
        onClick={vi.fn()}
      />,
    );
    expect(container.querySelector(".bg-blue-500")).not.toBeInTheDocument();
  });
});

describe("NavButton — mobile вариант", () => {
  it("отображает label", () => {
    render(
      <NavButton
        item={infoItem}
        active={false}
        isInChat={false}
        onClick={vi.fn()}
        variant="mobile"
      />,
    );
    expect(screen.getByText("Справка")).toBeInTheDocument();
  });

  it('показывает "В чате" badge для chats когда пользователь в чате', () => {
    render(
      <NavButton
        item={chatsItem}
        active={true}
        isInChat={true}
        onClick={vi.fn()}
        variant="mobile"
      />,
    );
    expect(screen.getByText("В чате")).toBeInTheDocument();
  });

  it('не показывает "В чате" badge для других пунктов', () => {
    render(
      <NavButton
        item={infoItem}
        active={false}
        isInChat={true}
        onClick={vi.fn()}
        variant="mobile"
      />,
    );
    expect(screen.queryByText("В чате")).not.toBeInTheDocument();
  });
});
