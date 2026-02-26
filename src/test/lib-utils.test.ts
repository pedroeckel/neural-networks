import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
  it("mergeia classes conflitantes do Tailwind", () => {
    const className = cn("px-2", "text-sm", "px-4", "font-semibold");

    expect(className).toContain("px-4");
    expect(className).not.toContain("px-2");
    expect(className).toContain("text-sm");
    expect(className).toContain("font-semibold");
  });
});
