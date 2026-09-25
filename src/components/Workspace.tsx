"use client";

import { useDatasetStore } from "@/store/dataset";
import { DataSourcePicker } from "./DataSourcePicker";
import { SchemaPreview } from "./SchemaPreview";

export function Workspace() {
  const { status, dataset, reset } = useDatasetStore();

  if (status === "ready" && dataset) {
    return <SchemaPreview dataset={dataset} onReset={reset} />;
  }
  return <DataSourcePicker />;
}
