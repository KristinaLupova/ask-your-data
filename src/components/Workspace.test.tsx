import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useDatasetStore } from "@/store/dataset";
import { Workspace } from "./Workspace";

describe("Workspace", () => {
  beforeEach(() => useDatasetStore.getState().reset());

  it("shows a schema preview after a CSV is uploaded", async () => {
    render(<Workspace />);
    const file = new File(["name,amount\nAda,10\nLin,20\n"], "people.csv", { type: "text/csv" });
    fireEvent.change(screen.getByTestId("file-input"), { target: { files: [file] } });

    expect(await screen.findByRole("heading", { name: "people.csv" })).toBeInTheDocument();
    expect(screen.getByText(/2 rows · 2 columns/)).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "amount" })).toBeInTheDocument();
  });

  it("shows an error for the wrong file type", async () => {
    render(<Workspace />);
    fireEvent.change(screen.getByTestId("file-input"), {
      target: { files: [new File(["x"], "notes.txt")] },
    });
    expect(await screen.findByRole("alert")).toHaveTextContent("Please choose a .csv file.");
  });

  it("goes back to the picker on reset", async () => {
    render(<Workspace />);
    fireEvent.change(screen.getByTestId("file-input"), {
      target: { files: [new File(["a\n1\n"], "a.csv")] },
    });
    fireEvent.click(await screen.findByRole("button", { name: "Use a different file" }));
    expect(screen.getByText("Drop a CSV file here")).toBeInTheDocument();
  });
});
