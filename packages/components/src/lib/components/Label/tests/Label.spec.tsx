import React from "react";
import { render, screen } from "@testing-library/react";
import { Label } from "../Label";

describe("Label", () => {
  it("renders with default props", () => {
    render(<Label>Test Label</Label>);
    const label = screen.getByText("Test Label");
    expect(label).toBeInTheDocument();
  });

  it("applies size prop correctly", () => {
    const { rerender } = render(<Label size="xs">Small Label</Label>);
    let container = screen.getByText("Small Label").parentElement;
    expect(container).toHaveAttribute("data-size", "xs");

    rerender(<Label size="sm">Medium Label</Label>);
    container = screen.getByText("Medium Label").parentElement;
    expect(container).toHaveAttribute("data-size", "sm");
  });

  it("applies variant prop correctly", () => {
    const { rerender } = render(<Label variant="default">Default Label</Label>);
    let container = screen.getByText("Default Label").parentElement;
    expect(container).toHaveAttribute("data-variant", "default");

    rerender(<Label variant="knockout">Knockout Label</Label>);
    container = screen.getByText("Knockout Label").parentElement;
    expect(container).toHaveAttribute("data-variant", "knockout");
  });

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Label ref={ref}>Ref Label</Label>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("applies custom className", () => {
    render(<Label className="custom-class">Custom Label</Label>);
    const container = screen.getByText("Custom Label").parentElement;
    expect(container).toHaveClass("custom-class");
  });

  it("forwards additional props", () => {
    render(<Label data-testid="label-test">Test Label</Label>);
    const container = screen.getByTestId("label-test");
    expect(container).toBeInTheDocument();
  });

  it("renders with semantic HTML structure", () => {
    render(<Label>Semantic Label</Label>);
    const textElement = screen.getByText("Semantic Label");
    expect(textElement.tagName).toBe("P");
  });
});
