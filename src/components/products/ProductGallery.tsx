"use client";

import Image from "next/image";
import { useState } from "react";

export default function ProductGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square overflow-hidden rounded bg-tile">
        {current && (
          <Image
            key={current}
            src={current}
            alt={title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain p-[12%] mix-blend-multiply"
          />
        )}
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2" role="tablist" aria-label="Product images">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Image ${i + 1} of ${images.length}`}
              onClick={() => setActive(i)}
              className={`relative aspect-square overflow-hidden rounded bg-tile outline-offset-2
                ${i === active ? "ring-2 ring-[#232323]" : "opacity-80 hover:opacity-100"}`}
            >
              <Image src={src} alt="" fill sizes="80px" className="object-contain p-[14%] mix-blend-multiply" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}