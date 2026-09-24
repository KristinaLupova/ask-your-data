export const SAMPLE_QUESTIONS = [
  "Which country had the biggest revenue drop last quarter?",
  "What is our monthly recurring revenue trend?",
  "Which payment method has the highest refund rate?",
];

export function Hero() {
  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-16 sm:py-24">
      <p className="text-sm font-medium uppercase tracking-wide text-foreground/60">
        AI analytics demo
      </p>
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
        Ask your data
      </h1>
      <p className="text-lg text-foreground/70">
        Upload a CSV, ask a question in plain English, and get an answer with a
        chart and the exact rows behind it.
      </p>
      <ul aria-label="Example questions" className="flex flex-col gap-2">
        {SAMPLE_QUESTIONS.map((q) => (
          <li
            key={q}
            className="rounded-lg border border-foreground/10 px-4 py-3 text-foreground/80"
          >
            “{q}”
          </li>
        ))}
      </ul>
      <p className="text-sm text-foreground/50">CSV upload is coming next.</p>
    </section>
  );
}
