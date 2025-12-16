import Link from "next/link";
import Image from "next/image";

export default function Details() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <main className="w-full max-w-3xl p-16 bg-white dark:bg-black">
        <Link href="/" className="text-sm text-zinc-600 hover:underline">
          ← Back
        </Link>

        <div className="mt-6 flex items-center gap-4">
          <Image
            src="/vercel.svg"
            alt="Vercel"
            width={48}
            height={48}
            className="dark:invert"
          />
          <div>
            <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
              Deployment Details
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 mt-1">
              This page shows details about the deploy flow.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
