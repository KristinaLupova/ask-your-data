import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { CsvError, detectColumnType, parseCsvFile, parseCsvText } from "./csv";

describe("detectColumnType", () => {
  it.each([
    [["1", "42", "-7"], "integer"],
    [["1.5", "2", "-0.25"], "number"],
    [["2026-01-31", "2025-12-01T10:30:00Z"], "date"],
    [["true", "No", "YES"], "boolean"],
    [["abc", "1"], "string"],
    [["", "  "], "string"],
  ])("%j -> %s", (values, expected) => {
    expect(detectColumnType(values)).toBe(expected);
  });

  it("ignores empty cells", () => {
    expect(detectColumnType(["1", "", "3"])).toBe("integer");
  });

  it("rejects impossible dates", () => {
    expect(detectColumnType(["2026-13-45"])).toBe("string");
  });

  it("accepts thousands separators", () => {
    expect(detectColumnType(["1,234.56", "12,000", "99.50"])).toBe("number");
  });

  it("rejects malformed comma groups", () => {
    expect(detectColumnType(["1,2,3"])).toBe("string");
    expect(detectColumnType(["12,34"])).toBe("string");
  });

  it("leaves European decimal commas as text (out of scope)", () => {
    expect(detectColumnType(["12,00", "23,45"])).toBe("string");
  });
});

describe("parseCsvText", () => {
  it("parses columns, types, rows and empty counts", () => {
    const ds = parseCsvText(
      "id,price,day\n1,9.99,2026-01-01\n2,,2026-01-02\n",
      "t.csv",
    );
    expect(ds.rows).toHaveLength(2);
    expect(ds.columns).toEqual([
      { name: "id", type: "integer", emptyCount: 0 },
      { name: "price", type: "number", emptyCount: 1 },
      { name: "day", type: "date", emptyCount: 0 },
    ]);
  });

  it("names blank headers and counts malformed rows", () => {
    const ds = parseCsvText("a,\n1,2\n3\n", "t.csv");
    expect(ds.columns.map((c) => c.name)).toEqual(["a", "column_1"]);
    expect(ds.malformedRowCount).toBe(1);
  });

  it("throws friendly errors", () => {
    expect(() => parseCsvText("   ", "t.csv")).toThrow(CsvError);
    expect(() => parseCsvText("a,b\n", "t.csv")).toThrow("no data rows");
  });

  it("detects the sample e-commerce schema", () => {
    const text = readFileSync("public/samples/ecommerce-orders.csv", "utf8");
    const types = Object.fromEntries(
      parseCsvText(text, "e.csv").columns.map((c) => [c.name, c.type]),
    );
    expect(types).toMatchObject({
      order_date: "date",
      quantity: "integer",
      revenue: "number",
      country: "string",
    });
  });
});

describe("parseCsvFile", () => {
  it("rejects non-CSV files and files over 5 MB", async () => {
    await expect(parseCsvFile(new File(["x"], "data.xlsx"))).rejects.toThrow(
      ".csv",
    );
    const big = new File(["x"], "big.csv");
    Object.defineProperty(big, "size", { value: 6 * 1024 * 1024 });
    await expect(parseCsvFile(big)).rejects.toThrow("5 MB");
  });
});
