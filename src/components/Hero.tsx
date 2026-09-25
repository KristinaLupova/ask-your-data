export function Hero() {
  return (
    <header className="flex flex-col gap-4">
      <p className="text-sm font-medium uppercase tracking-wide text-foreground/60">
        AI analytics demo
      </p>
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Ask your data</h1>
      <p className="text-lg text-foreground/70">
        Upload a CSV, ask a question in plain English, and get an answer with a chart and the
        exact rows behind it.
      </p>
    </header>
  );
}
