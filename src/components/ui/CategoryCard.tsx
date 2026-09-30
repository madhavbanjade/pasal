import { CategoryCardProps } from "@/src/types";
import Image from "next/image";
import Link from "next/link";

export default function CategoryCard({
  title,
  productCount,
  startingPrice,
  image,
  href,
}: CategoryCardProps) {
  return (
    <div className="">
      <Link
        href="#"
        className="group block w-full max-w-[330px] overflow-hiddn rounded-lg transition-transform duration-200 hover:-translate-y-1"
      >
        <div
          className="
          relative
          aspect-[1.42/1]
          w-full
          overflow-hidden
          rounded-md
          bg-[#f1f1ef]
        "
        >
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, 330px"
            className="
            object-contain
            p-5
            transition-transform
            duration-300
            group-hover:scale-105
          "
          />
        </div>

        {/* CONTENT */}
        <div className="pt-5 pb-3">
          <h5
          >
            {title}
          </h5>

          <p
        
          >
            {productCount} products, from ${startingPrice.toFixed(2)}
          </p>
        </div>
      </Link>
    </div>
  );
}
