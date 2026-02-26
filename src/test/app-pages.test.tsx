import React from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, getByText } from "@/test/test-utils";

const redirectMock = vi.fn();

vi.mock("next/navigation", () => ({
  redirect: (path: string) => redirectMock(path),
}));

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("@/views/IndexView", () => ({
  default: () => <div>INDEX_VIEW</div>,
}));

vi.mock("@/views/UnderConstructionPageView", () => ({
  default: ({ modelName }: { modelName: string }) => <div>UNDER_CONSTRUCTION:{modelName}</div>,
}));

import RootPage from "@/app/page";
import PerceptronPage from "@/app/perceptron/page";
import AdalinePage from "@/app/adaline/page";
import MlpPage from "@/app/mlp/page";
import SvmPage from "@/app/svm/page";
import NotFound from "@/app/not-found";

describe("App pages", () => {
  beforeEach(() => {
    redirectMock.mockClear();
  });

  it("redireciona a raiz para /perceptron", () => {
    RootPage();
    expect(redirectMock).toHaveBeenCalledWith("/perceptron");
  });

  it("renderiza a página de perceptron", () => {
    const { container, unmount } = render(<PerceptronPage />);

    expect(container.textContent).toContain("INDEX_VIEW");

    unmount();
  });

  it("renderiza páginas em construção com nome do modelo", () => {
    const adaline = render(<AdalinePage />);
    const mlp = render(<MlpPage />);
    const svm = render(<SvmPage />);

    expect(adaline.container.textContent).toContain("UNDER_CONSTRUCTION:Adaline");
    expect(mlp.container.textContent).toContain("UNDER_CONSTRUCTION:MLP");
    expect(svm.container.textContent).toContain("UNDER_CONSTRUCTION:SVM");

    adaline.unmount();
    mlp.unmount();
    svm.unmount();
  });

  it("renderiza o fallback 404 com link de retorno", () => {
    const { container, unmount } = render(<NotFound />);

    expect(container.textContent).toContain("404");
    expect(container.textContent).toContain("Page not found");

    const link = getByText(container, "Return to Home", "a") as HTMLAnchorElement;
    expect(link.getAttribute("href")).toBe("/perceptron");

    unmount();
  });
});
