"use client";

import { useRef, useState } from "react";
import { CsvError, parseCsvFile, parseCsvText } from "@/lib/csv";
import { SAMPLE_DATASETS, type SampleDataset } from "@/lib/samples";
import { useDatasetStore } from "@/store/dataset";

export function DataSourcePicker() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const { status, error, setLoading, setDataset, setError } = useDatasetStore();
  const loading = status === "loading";

  async function load(task: () => Promise<Parameters<typeof setDataset>[0]>) {
    setLoading();
    try {
      setDataset(await task());
    } catch (e) {
      setError(e instanceof CsvError ? e.message : "Something went wrong reading this file.");
    }
  }

  function handleFile(file: File | undefined) {
    if (file) void load(() => parseCsvFile(file));
  }

  function handleSample(sample: SampleDataset) {
    void load(async () => {
      const res = await fetch(sample.url);
      if (!res.ok) throw new CsvError("Couldn't load the sample dataset. Try again.");
      return parseCsvText(await res.text(), `${sample.label}.csv`);
    });
  }

  return (
    <section aria-label="Choose data" className="flex flex-col gap-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFile(e.dataTransfer.files[0]);
        }}
        className={`flex flex-col items-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
          dragging ? "border-foreground/60 bg-foreground/5" : "border-foreground/20"
        }`}
      >
        <p className="font-medium">Drop a CSV file here</p>
        <p className="text-sm text-foreground/60">Up to 5 MB. Your file stays in your browser.</p>
        <button
          type="button"
          disabled={loading}
          onClick={() => inputRef.current?.click()}
          className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-50"
        >
          {loading ? "Reading…" : "Choose file"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".csv,text/csv"
          className="sr-only"
          data-testid="file-input"
          onChange={(e) => {
            handleFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </div>

      {error && (
        <p role="alert" className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-2">
        <p className="text-sm text-foreground/60">No data handy? Try a sample:</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {SAMPLE_DATASETS.map((s) => (
            <button
              key={s.id}
              type="button"
              disabled={loading}
              onClick={() => handleSample(s)}
              className="rounded-lg border border-foreground/10 px-4 py-3 text-left hover:border-foreground/30 disabled:opacity-50"
            >
              <span className="block font-medium">{s.label}</span>
              <span className="block text-sm text-foreground/60">{s.description}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
