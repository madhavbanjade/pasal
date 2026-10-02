
export default function Price({
  price,
  compareAtPrice,
  size = "md",
}: {
  price: number;
  compareAtPrice?: number;
  size?: "md" | "lg";
}) {
  const onSale = compareAtPrice && compareAtPrice > price;
  const off = onSale ? Math.round((1 - price / compareAtPrice) * 100) : 0;

 const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

  return (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <span className={`font-semibold ${size === "lg" ? "text-2xl sm:text-[28px]" : "text-base"}`}>
        {money(price)}
      </span>
      {onSale && (
        <>
          <s className="text-[#676764]">
            <span className="sr-only">Was </span>
            {money(compareAtPrice)}
          </s>
          <span className="rounded bg-[#A2372B]/10 px-2 py-0.5 text-[13px] font-medium text-[#A2372B]">
            Save {off}%
          </span>
        </>
      )}
    </div>
  );
}