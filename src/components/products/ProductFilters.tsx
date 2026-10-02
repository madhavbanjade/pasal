"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function ProductFilters({ title, count }: { title: string; count: number }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const sort = searchParams.get("sort") ?? "featured"
  const q = searchParams.get("q") ?? ""

  const [query, setQuery] = useState(q)

  // keep the input in sync if the url changes from somewhere else (e.g. back button)
  useEffect(() => {
    setQuery(q)
  }, [q])

  function updateParams(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value)
      else params.delete(key)
    })
    params.delete("page")
    router.push(params.toString() ? `${pathname}?${params.toString()}` : pathname, { scroll: false })
  }

  // small debounce so we don't push a new url on every keystroke
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query !== q) updateParams({ q: query })
    }, 400)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  return (
    <div className=" flex flex-wrap items-start justify-between gap-6 mt-4">
      <div>
        <div className="flex items-baseline gap-2">
          <h2 className="text-2xl font-semibold tracking-[-0.02em]">{title}</h2>
          <span className="text-sm text-[#676764]">{count} products</span>
        </div>
      </div>

      <div className="flex w-full mt-8 flex-col gap-3 sm:mt-0 sm:w-64">
        <input
          type="search"
          className="input"
          placeholder="Search products"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <select
          className="input"
          value={sort}
          onChange={(e) => updateParams({ sort: e.target.value })}
        >
          <option value="featured">Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>
    </div>
  )
}
