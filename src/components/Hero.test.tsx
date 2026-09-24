import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Hero, SAMPLE_QUESTIONS } from "./Hero";

describe("Hero", () => {
  it("shows the product name", () => {
    render(<Hero />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Ask your data" }),
    ).toBeInTheDocument();
  });

  it("lists every example question", () => {
    render(<Hero />);
    const list = screen.getByRole("list", { name: "Example questions" });
    expect(list.querySelectorAll("li")).toHaveLength(SAMPLE_QUESTIONS.length);
  });
});
