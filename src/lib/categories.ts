export const CATEGORIES = [
  { label: "Men's clothing", value: "men's clothing" },
  { label: "Women's clothing", value: "women's clothing" },
  { label: "Jewellery", value: "jewelery" },
  { label: "Electronics", value: "electronics" },
] as const

export const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((category) => [category.value, category.label])
)
