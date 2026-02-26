import React from "react";
import { describe, expect, it } from "vitest";
import { render, click, changeInput, getByText, getAllByText } from "@/test/test-utils";
import ExercisesSection from "@/components/ExercisesSection";

describe("ExercisesSection", () => {
  it("valida respostas, mostra feedback e reinicia estado", () => {
    const { container, unmount } = render(
      <ExercisesSection
        inputs={[1, 0.5]}
        weights={[0.7, -0.4]}
        bias={0.1}
        theta={0.5}
        activationFn="limiar"
        weightedSum={0.6}
        output={1}
      />,
    );

    expect(container.textContent).toContain("0/3 corretos");

    click(getByText(container, "a)", "button"));

    const verifyButtons = getAllByText(container, "Verificar", "button");
    click(verifyButtons[0]);

    const numericInputs = Array.from(container.querySelectorAll<HTMLInputElement>('input[type="number"]'));
    changeInput(numericInputs[0], "0.6");
    changeInput(numericInputs[1], "999");

    const updatedVerifyButtons = getAllByText(container, "Verificar", "button");
    click(updatedVerifyButtons[1]);
    click(updatedVerifyButtons[2]);

    expect(container.textContent).toContain("Resposta correta");
    expect(container.textContent).toContain("Resposta incorreta");
    expect(container.textContent).toContain("2/3 corretos");

    click(getByText(container, "Reiniciar", "button"));

    expect(container.textContent).toContain("0/3 corretos");

    unmount();
  });
});
