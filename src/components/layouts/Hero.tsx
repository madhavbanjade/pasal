import { Product } from "@/src/types";
import Image from "next/image";
import Link from "next/link";

const SLOT = ["row-span-2 max-sm:row-span-1", "sm:col-span-2", "", "col-span-2 sm:col-span-1 max-sm:col-span-1"];
const DELAY = [
  "",
  "[animation-delay:80ms]",
  "[animation-delay:160ms]",
  "[animation-delay:240ms]",
];

export default function Hero({products}: {products: Product[] }) {
  return (
    <div className="md:flex gap-10 mt-8 max-md:space-y-8 md:items-center md:gap-8 lg:gap-10">
      <div className="flex flex-col  gap-6 w-full md:w-[42%] md:shrink-0 lg:w-[40%] max-sm:gap-4">
        <h1 className="text-center md:text-start">
          A small shop <br className="hidden lg:inline" /> with four aisles.
        </h1>
        <p>
          Everyday clothes for men and women, a <br className="hidden lg:inline" /> little jewellery, and the
          drives and monitors <br className="hidden lg:inline" /> that keep your desk running.
        </p>
        <div className="flex gap-8 flex-wrap max-sm:gap-3">
          <button className="btn max-sm:flex-1">Shop Now</button>
          <button className="btn--secondary max-sm:flex-1">See Best Rated</button>
        </div>

        <p>
          Free delivery on orders over $50. Pay by card, PayPal or cash on
          delivery.
        </p>
      </div>
      <div
        className="grid aspect-[4/5] grid-cols-1 grid-rows-[1.2fr_1fr_1fr] gap-2.5
                 sm:aspect-square sm:grid-cols-[1.25fr_1fr_1fr] sm:grid-rows-2 sm:gap-3
                 lg:aspect-[7/5] w-full md:flex-1 md:min-w-0 max-sm:aspect-auto max-sm:grid-rows-none"
      >

        {products.slice(0, 4).map((p,i) => (

   <Link
   key={p.id}
   href={`/product/${p.id}`}
   aria-label={`${p.title}, ${(p.price)}`}
          className={`relative flex min-h-0 flex-col overflow-hidden rounded bg-tile
                      px-2.5 pt-2.5 pb-2 text-[#232323] transition-colors hover:bg-tile-hover
                      focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary
                      sm:px-4 sm:pt-4 sm:pb-3
                      animate-rise motion-reduce:animate-none motion-reduce:transition-none max-sm:aspect-[4/3] ${SLOT[i]} ${DELAY[i]}`}
        >
          <span className="relative mx-[8%] my-[4%] min-h-0 flex-1">
            <Image
              src={p.image}
              alt=""
              fill
              priority={i == 0}
              sizes="(max-width: 600px) 50vw, (max-width: 1024px) 45vw, 30vw"
              className="object-contain mix-blend-multiply"
            />
          </span>

          <span className="flex items-baseline justify-between gap-1.5 text-xs sm:gap-2.5 sm:text-sm lg:text-[15px]">
            <span className="truncate text-[#5f5f5c]">{p.title}</span>
            <span className="shrink-0 font-semibold">{p.price}</span>
          </span>
        </Link>
        ))}
     
      </div>
    </div>
  );
}