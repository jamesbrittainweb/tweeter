import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-6 py-14">
      <h1 className="text-2xl font-semibold tracking-tight">Not found</h1>
      <p className="mt-2 text-sm text-muted">
        That page doesn’t exist (or it’s private).
      </p>
      <div className="mt-6">
        <Link
          href="/home"
          className="inline-flex rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background"
        >
          Go home
        </Link>
      </div>
    </main>
  );
}

