import { render, screen } from "@testing-library/react";
import { Search } from "lucide-react";
import { CapabilityCard } from "../components/info/CapabilityCard";

describe("CapabilityCard", () => {
  const defaultProps = {
    icon: Search,
    title: "Поиск информации",
    items: [
      "Гибридный поиск по документам",
      "Семантический векторный поиск",
      "Ранжирование результатов",
    ],
  };

  it("отображает заголовок карточки", () => {
    render(<CapabilityCard {...defaultProps} />);
    expect(screen.getByText("Поиск информации")).toBeInTheDocument();
  });

  it("отображает все элементы списка", () => {
    render(<CapabilityCard {...defaultProps} />);
    expect(
      screen.getByText("Гибридный поиск по документам"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Семантический векторный поиск"),
    ).toBeInTheDocument();
    expect(screen.getByText("Ранжирование результатов")).toBeInTheDocument();
  });

  it("рендерит правильное количество элементов", () => {
    render(<CapabilityCard {...defaultProps} />);
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(3);
  });

  it("рендерит иконку", () => {
    render(<CapabilityCard {...defaultProps} />);
    expect(document.querySelector("svg")).toBeInTheDocument();
  });
});
