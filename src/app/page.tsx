import { Hero } from "@/components/Hero";
import { Workspace } from "@/components/Workspace";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-4 py-12 sm:py-16">
      <Hero />
      <Workspace />
    </main>
  );
}
