import React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, click, getAllByText } from "@/test/test-utils";

vi.mock("@/components/ui/slider", () => ({
  Slider: ({ value, onValueChange }: { value?: number[]; onValueChange?: (next: number[]) => void }) => (
    <button
      type="button"
      data-current={value?.[0] ?? 0}
      onClick={() => onValueChange?.([1.25])}
    >
      slider
    </button>
  ),
}));

import ControlPanel from "@/components/ControlPanel";

describe("ControlPanel", () => {
  it("dispara callbacks de entradas, pesos, bias, theta e função de ativação", () => {
    const onInputChange = vi.fn();
    const onWeightChange = vi.fn();
    const onBiasChange = vi.fn();
    const onThetaChange = vi.fn();
    const onActivationChange = vi.fn();

    const { container, unmount } = render(
      <ControlPanel
        inputs={[1, 0.5]}
        weights={[0.7, -0.4]}
        bias={0.1}
        theta={0.5}
        activationFn="limiar"
        onInputChange={onInputChange}
        onWeightChange={onWeightChange}
        onBiasChange={onBiasChange}
        onThetaChange={onThetaChange}
        onActivationChange={onActivationChange}
      />,
    );

    const sliderButtons = getAllByText(container, "slider", "button");
    sliderButtons.forEach((button) => click(button));

    expect(onInputChange).toHaveBeenCalledWith(0, 1.25);
    expect(onInputChange).toHaveBeenCalledWith(1, 1.25);
    expect(onWeightChange).toHaveBeenCalledWith(0, 1.25);
    expect(onWeightChange).toHaveBeenCalledWith(1, 1.25);
    expect(onBiasChange).toHaveBeenCalledWith(1.25);
    expect(onThetaChange).toHaveBeenCalledWith(1.25);

    click(getAllByText(container, "Sigmoid", "button")[0]);
    click(getAllByText(container, "ReLU", "button")[0]);

    expect(onActivationChange).toHaveBeenCalledWith("sigmoid");
    expect(onActivationChange).toHaveBeenCalledWith("relu");

    unmount();
  });
});
