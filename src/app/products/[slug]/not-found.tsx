import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-24 text-center sm:px-6">
      <h1 className="mb-3 text-3xl font-bold">We couldn't find that product</h1>
      <p className="mb-6 text-[#676764]">It may have sold out, or the link might be wrong.</p>
      <Link href="/products" className="btn">Back to the shop</Link>
    </div>
  );
}