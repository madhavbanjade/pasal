"use client";

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
      <button type="button" className="btn mt-2" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
