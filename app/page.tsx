import Link from "next/link";
import { AuthButton } from "@/components/AuthButton";
import { DevModeToggle } from "@/components/DevModeToggle";
import { LevelSelect } from "@/components/LevelSelect";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-zinc-800 px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link href="/" className="text-xl font-bold text-amber-500">
            Nostr Learn
          </Link>
          <div className="flex items-center gap-4">
            <DevModeToggle />
            <AuthButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-zinc-100 sm:text-4xl">
            Learn Nostr by Playing
          </h1>
          <p className="mt-4 text-lg text-zinc-400">
            Master the decentralized protocol through hands-on tasks and quizzes.
            Sign in with Nostr to save progress across devices and share achievements.
          </p>
        </div>

        <LevelSelect />
      </main>
    </div>
  );
}
