// Stars fill fractionally: 3.9 shows almost four stars.
export default function Rating({
  rate,
  count,
  suffix = "",
  className = "",
}: {
  rate: number;
  count: number;
  suffix?: string;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-[13px] text-[#676764] ${className}`}>
      <span className="relative inline-block leading-none tracking-[1px] text-[#DCDCD7]" aria-hidden="true">
        ★★★★★
        <span
          className="absolute inset-y-0 left-0 overflow-hidden whitespace-nowrap text-[#B7791F]"
          style={{ width: `${(Math.min(5, Math.max(0, rate)) / 5) * 100}%` }}
        >
          ★★★★★
        </span>
      </span>
      <span>
        {rate.toFixed(1)} <span className="sr-only">out of 5,</span>({count}
        {suffix})
      </span>
    </span>
  );
}