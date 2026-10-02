import type { MetadataRoute } from "next";
import { fetchAPI } from "@/src/services/api.service";
import { SITE_URL } from "@/src/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const res = await fetchAPI({ endPoint: "products" });
  const products: { id: number }[] = res?.data ?? [];

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${SITE_URL}/products/${product.id}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [
    {
      url: SITE_URL,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/products`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...productRoutes,
  ];
}
