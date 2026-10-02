"use client"
import Breadcrumbs from "@/src/components/products/Breadcrumbs";
import ProductGallery from "@/src/components/products/ProductGallary";
import ProductInfo from "@/src/components/products/ProductInfo";
import { fetchAPI } from "@/src/services/api.service";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import NotFound from "./not-found";
import Loading from "./Loading";
import RelatedProducts from "@/src/components/products/RelatedProducts";


export default function ProductDetailPage(){
      const { slug } = useParams()
  const [product, setProduct] = useState<any>(undefined)
  const [related, setRelated] = useState<any[]>([])

   useEffect(() => {
    setProduct(undefined)
    async function load() {
      const res = await fetchAPI({ endPoint: `products/${slug}` })
      setProduct(res?.data ?? null)
    }
    load()
  }, [slug])

  useEffect(() => {
    if (!product?.category) return
    async function loadRelated() {
      const res = await fetchAPI({ endPoint: `products/category/${product.category}` })
      const items = (res?.data ?? []).filter((p: any) => p.id !== product.id)
      setRelated(items.slice(0, 3))
    }
    loadRelated()
  }, [product])


  
  if (product === undefined) {
    return <Loading />
  }

  if (!product) {
    return(
    <NotFound />

    )
  }


  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: product.images,
    description: product.description,
    sku: String(product.id),
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "USD",
      availability: product.stock === 0 ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
    },
    ...(product.rating && {
      aggregateRating: { "@type": "AggregateRating", ratingValue: product.rating.rate, reviewCount: product.rating.count },
    }),
  };



    return(
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
    )
}