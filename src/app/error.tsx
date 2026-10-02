"use client";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <p className="text-[#676764]">{error.message || "We couldn't load this page. Please try again."}</p>
      <div className="mt-2 flex gap-3">
        <button type="button" className="btn" onClick={reset}>
          Try again
        </button>
        <Link href="/" className="btn--secondary">Back to Home</Link>
      </div>
    </div>
  );
}
