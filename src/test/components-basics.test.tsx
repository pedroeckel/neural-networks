import React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, click, getByText, findByText } from "@/test/test-utils";

let currentPathname = "/perceptron";

vi.mock("next/navigation", () => ({
  usePathname: () => currentPathname,
}));

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

import MainMenu from "@/components/MainMenu";
import ConceptPanel from "@/components/ConceptPanel";
import CalculationSteps from "@/components/CalculationSteps";

describe("MainMenu", () => {
  it("marca a rota ativa com estilo primário", () => {
    currentPathname = "/perceptron";
    const { container, unmount } = render(<MainMenu />);

    const perceptronLink = getByText(container, "Perceptron", "a");
    const adalineLink = getByText(container, "Adaline", "a");

    expect(perceptronLink.className).toContain("bg-primary");
    expect(adalineLink.className).not.toContain("bg-primary");

    unmount();
  });
});

describe("ConceptPanel", () => {
  it("expande e recolhe seções ao clicar no título", () => {
    const { container, unmount } = render(<ConceptPanel />);

    expect(container.textContent).toContain("Este simulador mostra um neurônio do tipo Perceptron em tempo real.");

    click(getByText(container, "Como o cálculo é feito?", "button"));

    expect(container.textContent).toContain("A inferência do neurônio segue este fluxo:");
    expect(findByText(container, "Este simulador mostra um neurônio do tipo Perceptron em tempo real.")).toBeNull();

    click(getByText(container, "Como o cálculo é feito?", "button"));
    expect(findByText(container, "A inferência do neurônio segue este fluxo:")).toBeNull();

    unmount();
  });
});

describe("CalculationSteps", () => {
  it("mostra interpretação de limiar conforme y* e theta", () => {
    const baseProps = {
      inputs: [1, 0.5],
      weights: [0.7, -0.4],
      bias: 0.1,
      theta: 0.5,
      activationFn: "limiar",
    };

    const { container, rerender, unmount } = render(
      <CalculationSteps {...baseProps} weightedSum={0.3} output={0} />,
    );

    expect(container.textContent).toContain("∈ [-θ, θ] → y = 0");

    rerender(<CalculationSteps {...baseProps} weightedSum={0.8} output={1} />);

    expect(container.textContent).toContain("> θ → y = 1");

    unmount();
  });
});
