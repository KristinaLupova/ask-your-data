import { create } from "zustand";
import type { Dataset } from "@/lib/csv";

type Status = "idle" | "loading" | "ready" | "error";

interface DatasetState {
  status: Status;
  dataset: Dataset | null;
  error: string | null;
  setLoading: () => void;
  setDataset: (dataset: Dataset) => void;
  setError: (message: string) => void;
  reset: () => void;
}

export const useDatasetStore = create<DatasetState>((set) => ({
  status: "idle",
  dataset: null,
  error: null,
  setLoading: () => set({ status: "loading", error: null }),
  setDataset: (dataset) => set({ status: "ready", dataset, error: null }),
  setError: (error) => set({ status: "error", error, dataset: null }),
  reset: () => set({ status: "idle", dataset: null, error: null }),
}));
