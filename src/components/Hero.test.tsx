import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Hero } from "./Hero";

describe("Hero", () => {
  it("shows the product name", () => {
    render(<Hero />);
    expect(screen.getByRole("heading", { level: 1, name: "Ask your data" })).toBeInTheDocument();
  });
});
