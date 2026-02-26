import React from "react";
import { act } from "react";
import { describe, expect, it } from "vitest";
import { useIsMobile } from "@/hooks/use-mobile";
import { render } from "@/test/test-utils";

function Probe() {
  const isMobile = useIsMobile();
  return <span>{isMobile ? "mobile" : "desktop"}</span>;
}

describe("useIsMobile", () => {
  it("reage à largura da janela e ao evento de change", async () => {
    const listeners = new Set<() => void>();

    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: () => ({
        matches: window.innerWidth < 768,
        media: "(max-width: 767px)",
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: (_: string, cb: () => void) => listeners.add(cb),
        removeEventListener: (_: string, cb: () => void) => listeners.delete(cb),
        dispatchEvent: () => true,
      }),
    });

    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      writable: true,
      value: 500,
    });

    const { container, unmount } = render(<Probe />);

    await act(async () => {
      await Promise.resolve();
    });

    expect(container.textContent).toContain("mobile");

    window.innerWidth = 1024;

    await act(async () => {
      listeners.forEach((listener) => listener());
      await Promise.resolve();
    });

    expect(container.textContent).toContain("desktop");

    unmount();
  });
});
