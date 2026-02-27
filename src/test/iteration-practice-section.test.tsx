import React from "react";
import { describe, expect, it } from "vitest";
import { render, click, getByText } from "@/test/test-utils";
import IterationPracticeSection from "@/components/IterationPracticeSection";

describe("IterationPracticeSection", () => {
  it("mostra convergência para AND e não convergência para XOR", () => {
    const { container, unmount } = render(<IterationPracticeSection activationFn="sigmoid" />);

    expect(container.textContent).toContain("Convergiu em");
    expect(container.textContent).toContain("Função de ativação");
    expect(container.textContent).toContain("continua usando a regra clássica de treino do Perceptron");

    click(getByText(container, "5. XOR", "button"));

    expect(container.textContent).toContain("Não convergiu em 20 épocas");

    unmount();
  });

  it("permite selecionar amostra e atualiza a explicação da iteração", () => {
    const { container, unmount } = render(<IterationPracticeSection activationFn="limiar" />);

    click(getByText(container, "5. XOR", "button"));
    click(getByText(container, "A2: (1,0) d=1", "button"));

    expect(container.textContent).toContain("amostra 2");
    expect(container.textContent).toContain("Fronteira antes da atualização");
    expect(container.textContent).toContain("Fronteira depois da atualização");

    unmount();
  });
});
