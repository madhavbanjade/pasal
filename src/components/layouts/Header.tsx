import Link from "next/link";
import { CATEGORIES } from "@/src/lib/categories";
import CartButton from "./CartButton";

export default function Header(){
    return(
       <div className="header z-10">
      <div className="container">
         <Link href="/">
        <img src="/images/logo.png" alt="Pasal" className="header__logo w-16 sm:w-23"  />

         </Link>

         <div className="header__nav">
        {CATEGORIES.map((category) => (
          <Link key={category.value} href={`/products?category=${encodeURIComponent(category.value)}`}>
            {category.label}
          </Link>
        ))}
         </div>

<div className="flex gap-4">
   <CartButton />
</div>


      </div>

       </div> 
    )
}