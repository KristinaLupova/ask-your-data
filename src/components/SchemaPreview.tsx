import { formatBytes, PREVIEW_ROWS, type ColumnType, type Dataset } from "@/lib/csv";

const TYPE_LABEL: Record<ColumnType, string> = {
  integer: "Integer",
  number: "Number",
  date: "Date",
  boolean: "Yes/No",
  string: "Text",
};

interface Props {
  dataset: Dataset;
  onReset: () => void;
}

export function SchemaPreview({ dataset, onReset }: Props) {
  const { name, sizeBytes, columns, rows, malformedRowCount } = dataset;
  const numeric = (t: ColumnType) => t === "integer" || t === "number";

  return (
    <section aria-label="Dataset preview" className="flex flex-col gap-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">{name}</h2>
          <p className="text-sm text-foreground/60">
            {rows.length.toLocaleString("en-US")} rows · {columns.length} columns · {formatBytes(sizeBytes)}
          </p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="rounded-lg border border-foreground/20 px-3 py-1.5 text-sm hover:border-foreground/40"
        >
          Use a different file
        </button>
      </header>

      {malformedRowCount > 0 && (
        <p role="status" className="rounded-lg bg-amber-500/10 px-4 py-3 text-sm text-amber-800 dark:text-amber-200">
          {malformedRowCount} {malformedRowCount === 1 ? "row has" : "rows have"} a different number of
          fields than the header. They are included, but some values may be missing.
        </p>
      )}

      <div>
        <h3 className="mb-2 text-sm font-medium text-foreground/60">Columns</h3>
        <ul aria-label="Columns" className="flex flex-wrap gap-2">
          {columns.map((c) => (
            <li key={c.name} className="rounded-md border border-foreground/10 px-2.5 py-1 text-sm">
              <span className="font-medium">{c.name}</span>{" "}
              <span className="text-foreground/50">{TYPE_LABEL[c.type]}</span>
              {c.emptyCount > 0 && (
                <span className="text-foreground/50"> · {c.emptyCount} empty</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium text-foreground/60">
          First {Math.min(PREVIEW_ROWS, rows.length)} rows
        </h3>
        <div className="overflow-x-auto rounded-lg border border-foreground/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-foreground/5">
              <tr>
                {columns.map((c) => (
                  <th
                    key={c.name}
                    scope="col"
                    className={`whitespace-nowrap px-3 py-2 font-medium ${numeric(c.type) ? "text-right" : ""}`}
                  >
                    {c.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, PREVIEW_ROWS).map((row, i) => (
                <tr key={i} className="border-t border-foreground/10">
                  {columns.map((c) => (
                    <td
                      key={c.name}
                      className={`whitespace-nowrap px-3 py-1.5 ${numeric(c.type) ? "text-right tabular-nums" : ""}`}
                    >
                      {row[c.name]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
