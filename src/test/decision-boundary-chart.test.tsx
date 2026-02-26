import React from "react";
import { describe, expect, it } from "vitest";
import { render, click, clickAt, getByText } from "@/test/test-utils";
import DecisionBoundaryChart from "@/components/DecisionBoundaryChart";

describe("DecisionBoundaryChart", () => {
  it("limpa, reseta e permite adicionar/remover pontos por clique", () => {
    const { container, unmount } = render(
      <DecisionBoundaryChart weights={[1, -1]} bias={0} theta={0.5} activationFn="limiar" />,
    );

    const countPoints = () => container.querySelectorAll("g.cursor-pointer").length;
    expect(countPoints()).toBe(12);

    click(getByText(container, "Limpar", "button"));
    expect(countPoints()).toBe(0);

    const svg = container.querySelector("svg.cursor-crosshair") as SVGSVGElement;
    Object.defineProperty(svg, "getBoundingClientRect", {
      configurable: true,
      value: () => ({
        left: 0,
        top: 0,
        width: 380,
        height: 380,
        right: 380,
        bottom: 380,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }),
    });

    clickAt(svg, 190, 190);
    expect(countPoints()).toBe(1);

    clickAt(svg, 190, 190);
    expect(countPoints()).toBe(0);

    click(getByText(container, "Resetar", "button"));
    expect(countPoints()).toBe(12);

    unmount();
  });

  it("ajusta o hint e a legenda para ativação gaussiana", () => {
    const { container, unmount } = render(
      <DecisionBoundaryChart weights={[1, 1]} bias={0} theta={0.5} activationFn="gaussian" />,
    );

    expect(container.textContent).toContain("|y*| ≤");
    expect(container.textContent).toContain("Fronteiras");

    unmount();
  });
});
