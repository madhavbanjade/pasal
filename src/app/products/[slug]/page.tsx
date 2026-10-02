import ProductGallery from "@/src/components/products/ProductGallery";
import ProductInfo from "@/src/components/products/ProductInfo";
import RelatedProducts from "@/src/components/products/RelatedProducts";
import { fetchAPI } from "@/src/services/api.service";
import { notFound } from "next/navigation";
import type { ProductCardUi } from "@/src/types";
import type { Metadata } from "next";
import { SITE_URL } from "@/src/lib/seo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const res = await fetchAPI<ProductCardUi[]>({ endPoint: "products" });
  const products = res.success ? res.data : [];
  return products.map((product) => ({ slug: String(product.id) }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const res = await fetchAPI<ProductCardUi>({ endPoint: `products/${slug}` });
  const product = res.success ? res.data : null;

  if (!product) return { title: "Product not found" };

  return {
    title: product.title,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: [product.image],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const res = await fetchAPI<ProductCardUi>({ endPoint: `products/${slug}` });
  if (!res.success) throw new Error(res.error);

  const product = res.data;
  if (!product) notFound();

  const relatedRes = await fetchAPI<ProductCardUi[]>({ endPoint: `products/category/${product.category}` });
  const related = (relatedRes.success ? relatedRes.data : [])
    .filter((p) => p.id !== product.id)
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: `${SITE_URL}${product.image}`,
    description: product.description,
    sku: String(product.id),
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "USD",
      // fakestoreapi has no stock field, so every product is treated as in stock
      availability: "https://schema.org/InStock",
    },
    ...(product.rating && {
      aggregateRating: { "@type": "AggregateRating", ratingValue: product.rating.rate, reviewCount: product.rating.count },
    }),
  };

  return (
    <div className="container px-4 pt-6 pb-24 sm:px-6 md:pb-16 lg:pt-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="grid gap-8 md:grid-cols-2 md:gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        {/* gallery stays in view while the details scroll on larger screens */}
        <div className="md:sticky md:top-24 md:self-start">
          <ProductGallery images={[product.image]} title={product.title} />
        </div>
        <ProductInfo product={product} />
      </div>

      <RelatedProducts products={related} category={product.category} />
    </div>
  );
}
