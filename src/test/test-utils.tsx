import type { ReactElement } from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";

type TextMatcher = string | RegExp;

const normalize = (value: string) => value.replace(/\s+/g, " ").trim();

const matches = (text: string, matcher: TextMatcher) => {
  const normalized = normalize(text);
  if (typeof matcher === "string") {
    return normalized.includes(normalize(matcher));
  }
  return matcher.test(normalized);
};

export interface RenderResult {
  container: HTMLDivElement;
  rerender: (ui: ReactElement) => void;
  unmount: () => void;
}

export function render(ui: ReactElement): RenderResult {
  const container = document.createElement("div");
  document.body.appendChild(container);

  const root: Root = createRoot(container);
  act(() => {
    root.render(ui);
  });

  return {
    container,
    rerender(nextUi) {
      act(() => {
        root.render(nextUi);
      });
    },
    unmount() {
      act(() => {
        root.unmount();
      });
      container.remove();
    },
  };
}

export function cleanup(container?: HTMLElement | null) {
  if (container && container.parentNode) {
    container.parentNode.removeChild(container);
  }
}

export function findByText(container: HTMLElement, matcher: TextMatcher, selector = "*"): HTMLElement | null {
  const elements = Array.from(container.querySelectorAll<HTMLElement>(selector));
  return elements.find((el) => matches(el.textContent ?? "", matcher)) ?? null;
}

export function getByText(container: HTMLElement, matcher: TextMatcher, selector = "*"): HTMLElement {
  const element = findByText(container, matcher, selector);
  if (!element) {
    throw new Error(`Element not found for matcher: ${String(matcher)}`);
  }
  return element;
}

export function getAllByText(container: HTMLElement, matcher: TextMatcher, selector = "*"): HTMLElement[] {
  const elements = Array.from(container.querySelectorAll<HTMLElement>(selector));
  const matched = elements.filter((el) => matches(el.textContent ?? "", matcher));
  if (!matched.length) {
    throw new Error(`No elements found for matcher: ${String(matcher)}`);
  }
  return matched;
}

export function click(element: Element) {
  act(() => {
    element.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
  });
}

export function clickAt(element: Element, clientX: number, clientY: number) {
  act(() => {
    element.dispatchEvent(
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        clientX,
        clientY,
      }),
    );
  });
}

export function changeInput(element: HTMLInputElement, value: string) {
  const valueSetter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    "value",
  )?.set;

  act(() => {
    if (valueSetter) {
      valueSetter.call(element, value);
    } else {
      element.value = value;
    }
    element.dispatchEvent(new Event("input", { bubbles: true }));
    element.dispatchEvent(new Event("change", { bubbles: true }));
  });
}

export async function flushMicrotasks() {
  await Promise.resolve();
  await Promise.resolve();
}
