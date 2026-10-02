import Link from "next/link";
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
                <img src={product.image} alt="card" />
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
                <AddToCartButton />
              </div>
            </div>
        </Link>
    
  );
}
