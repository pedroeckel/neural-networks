import React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, click, getByText } from "@/test/test-utils";

vi.mock("@/components/MainMenu", () => ({ default: () => <div>MAIN_MENU</div> }));
vi.mock("@/components/ConceptPanel", () => ({ default: () => <div>CONCEPT_PANEL</div> }));
vi.mock("@/components/AlgorithmSteps", () => ({ default: () => <div>ALGORITHM_STEPS</div> }));
vi.mock("@/components/IterationPracticeSection", () => ({ default: () => <div>ITERATION_SECTION</div> }));
vi.mock("@/components/CodeExamples", () => ({ default: () => <div>CODE_EXAMPLES</div> }));
vi.mock("@/components/ExercisesSection", () => ({
  default: ({ output }: { output: number }) => <div>EXERCISES_OUTPUT:{output.toFixed(4)}</div>,
}));
vi.mock("@/components/DecisionBoundaryChart", () => ({
  default: ({ activationFn }: { activationFn: string }) => <div>BOUNDARY_FN:{activationFn}</div>,
}));
vi.mock("@/components/PerceptronVisualization", () => ({
  default: ({ weightedSum, output }: { weightedSum: number; output: number }) => (
    <div>VIZ:{weightedSum.toFixed(4)}|{output.toFixed(4)}</div>
  ),
}));
vi.mock("@/components/CalculationSteps", () => ({
  default: ({ weightedSum, output }: { weightedSum: number; output: number }) => (
    <div>STEPS:{weightedSum.toFixed(4)}|{output.toFixed(4)}</div>
  ),
}));
vi.mock("@/components/ControlPanel", () => ({
  default: ({
    onActivationChange,
    onInputChange,
  }: {
    onActivationChange: (fn: string) => void;
    onInputChange: (index: number, value: number) => void;
  }) => (
    <div>
      <button type="button" onClick={() => onActivationChange("sigmoid")}>set-sigmoid</button>
      <button type="button" onClick={() => onInputChange(0, 2)}>set-x1</button>
    </div>
  ),
}));

import IndexView from "@/views/IndexView";

describe("IndexView", () => {
  it("calcula y* e saída e reage às mudanças no painel", () => {
    const { container, unmount } = render(<IndexView />);

    expect(container.textContent).toContain("VIZ:0.6000|1.0000");
    expect(container.textContent).toContain("BOUNDARY_FN:limiar");

    click(getByText(container, "set-sigmoid", "button"));

    expect(container.textContent).toContain("VIZ:0.6000|0.6457");
    expect(container.textContent).toContain("BOUNDARY_FN:sigmoid");

    click(getByText(container, "set-x1", "button"));

    expect(container.textContent).toContain("VIZ:1.3000|0.7858");
    expect(container.textContent).toContain("STEPS:1.3000|0.7858");
    expect(container.textContent).toContain("EXERCISES_OUTPUT:0.7858");

    unmount();
  });
});
