"use client";

import { useState } from "react";

export default function QuantityAdd({
  initial = 1,
  min = 1,
  max = 10,
}: {
  initial?: number;
  min?: number;
  max?: number;
}) {
  const [qty, setQty] = useState(initial);

  return (
    <div className="inline-flex items-center rounded border border-[#DCDCD7]" role="group" aria-label="Quantity">
      <button
        type="button"
        className="h-11 w-10 text-lg disabled:opacity-30"
        aria-label="Decrease quantity"
        disabled={qty <= min}
        onClick={() => setQty((q) => Math.max(min, q - 1))}
      >
        −
      </button>
      <span className="w-8 text-center tabular-nums" aria-live="polite">{qty}</span>
      <button
        type="button"
        className="h-11 w-10 text-lg disabled:opacity-30"
        aria-label="Increase quantity"
        disabled={qty >= max}
        onClick={() => setQty((q) => Math.min(max, q + 1))}
      >
        +
      </button>
    </div>
  );
}
