import Link from "next/link";
import Image from "next/image";
import AddToCartButton from "./AddToCartButton";
import { ProductCardUi } from "@/src/types";


interface ProductCardProps {
    product: ProductCardUi
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
        <Link key={product.id} href={`/products/${product.id}`} className="">
            <div className="card border border-gray-100 p-2 rounded-lg mb-4 ">
              <div className="card__image">
                <Image src={product.image} alt={product.title} width={300} height={300} />
              </div>
              <div className="card__category">{product.category}</div>
              <h5 className="card__title">
                {product.title}
              </h5>
              <span className="card__rating">
           {product.rating.rate}
              </span>
              <div className="card__footer">
                <span className="card__price">{product.price}</span>
                <AddToCartButton product={product} />
              </div>
            </div>
        </Link>
    
  );
}
