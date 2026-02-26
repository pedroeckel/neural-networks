import React from "react";
import { act } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, click, getByText, findByText, flushMicrotasks } from "@/test/test-utils";
import CodeExamples from "@/components/CodeExamples";

describe("CodeExamples", () => {
  const writeText = vi.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    vi.useFakeTimers();
    Object.defineProperty(window.navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    writeText.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("executa snippet JS, copia código e alterna linguagem", async () => {
    const { container, unmount } = render(<CodeExamples />);

    click(getByText(container, "Executar", "button"));
    expect(container.textContent).toContain("Predicoes:");

    await act(async () => {
      click(getByText(container, "Copiar", "button"));
      await flushMicrotasks();
    });

    expect(writeText).toHaveBeenCalled();
    expect(container.textContent).toContain("Copiado!");

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(container.textContent).toContain("Copiar");

    click(getByText(container, "Python", "button"));
    expect(findByText(container, "Executar", "button")).toBeNull();

    unmount();
  });
});
