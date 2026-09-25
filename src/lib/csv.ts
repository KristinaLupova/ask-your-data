import Papa from "papaparse";

export const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB
export const PREVIEW_ROWS = 20;
const TYPE_SAMPLE_ROWS = 1000;

export type ColumnType = "integer" | "number" | "date" | "boolean" | "string";

export interface ColumnInfo {
  name: string;
  type: ColumnType;
  emptyCount: number;
}

export type Row = Record<string, string>;

export interface Dataset {
  name: string;
  sizeBytes: number;
  columns: ColumnInfo[];
  rows: Row[];
  /** Rows whose field count didn't match the header. Kept, but worth showing. */
  malformedRowCount: number;
}

export class CsvError extends Error {}

const INTEGER = /^-?\d+$/;
const NUMBER = /^-?(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d+)?(e[+-]?\d+)?$/i;
const ISO_DATE =
  /^\d{4}-\d{2}-\d{2}([ T]\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?)?$/;
const BOOLEAN = /^(true|false|yes|no)$/i;

function matchesType(value: string, type: ColumnType): boolean {
  switch (type) {
    case "integer":
      return INTEGER.test(value);
    case "number":
      return NUMBER.test(value);
    case "date":
      return ISO_DATE.test(value) && !Number.isNaN(Date.parse(value));
    case "boolean":
      return BOOLEAN.test(value);
    case "string":
      return true;
  }
}

/** Most specific type that every non-empty value matches. */
export function detectColumnType(values: string[]): ColumnType {
  const filled = values.map((v) => v.trim()).filter((v) => v !== "");
  if (filled.length === 0) return "string";
  const candidates: ColumnType[] = ["boolean", "integer", "number", "date"];
  return (
    candidates.find((t) => filled.every((v) => matchesType(v, t))) ?? "string"
  );
}

export function parseCsvText(text: string, name: string): Dataset {
  if (text.trim() === "") throw new CsvError("This file is empty.");

  let blankHeaders = 0;
  const result = Papa.parse<Row>(text, {
    header: true,
    skipEmptyLines: "greedy",
    transformHeader: (h) => {
      const clean = h.trim();
      return clean === "" ? `column_${++blankHeaders}` : clean;
    },
  });

  const fields = result.meta.fields ?? [];
  if (fields.length === 0) throw new CsvError("No header row found.");
  if (result.data.length === 0)
    throw new CsvError("The file has a header but no data rows.");

  const malformedRowCount = new Set(
    result.errors.filter((e) => e.type === "FieldMismatch").map((e) => e.row),
  ).size;

  const sample = result.data.slice(0, TYPE_SAMPLE_ROWS);
  const columns: ColumnInfo[] = fields.map((field) => {
    const values = result.data.map((r) => r[field] ?? "");
    return {
      name: field,
      type: detectColumnType(sample.map((r) => r[field] ?? "")),
      emptyCount: values.filter((v) => v.trim() === "").length,
    };
  });

  return {
    name,
    sizeBytes: new Blob([text]).size,
    columns,
    rows: result.data,
    malformedRowCount,
  };
}

export async function parseCsvFile(file: File): Promise<Dataset> {
  if (!file.name.toLowerCase().endsWith(".csv")) {
    throw new CsvError("Please choose a .csv file.");
  }
  if (file.size > MAX_FILE_BYTES) {
    throw new CsvError(
      `This file is ${formatBytes(file.size)}. The limit is 5 MB.`,
    );
  }
  return parseCsvText(await file.text(), file.name);
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
