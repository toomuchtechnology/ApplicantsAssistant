import { render, screen } from "@testing-library/react";
import { MessageSquare } from "lucide-react";
import { FeatureCard } from "../components/info/FeatureCard";

describe("FeatureCard", () => {
  const defaultProps = {
    icon: MessageSquare,
    title: "Чат с ИИ",
    description: "Интерактивное общение с AI-ассистентом",
  };

  it("отображает заголовок", () => {
    render(<FeatureCard {...defaultProps} />);
    expect(screen.getByText("Чат с ИИ")).toBeInTheDocument();
  });

  it("отображает описание", () => {
    render(<FeatureCard {...defaultProps} />);
    expect(
      screen.getByText("Интерактивное общение с AI-ассистентом"),
    ).toBeInTheDocument();
  });

  it("рендерит иконку", () => {
    render(<FeatureCard {...defaultProps} />);
    expect(document.querySelector("svg")).toBeInTheDocument();
  });
});
