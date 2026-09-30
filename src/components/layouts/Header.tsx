import Link from "next/link";

export default function Header(){
    return(
       <div className="header">
      <div className="container">
        <img src="/images/logo.png" alt="Pasal" className="header__logo w-23" />

         <div className="header__nav">
        <Link href="#">Men's Clothing</Link>
        <Link href="#">Women's Clothing</Link>
        <Link href="#">Jewellary</Link>
        <Link href="#">Electronics</Link>
         </div>

<div className="flex gap-4">
   <button className="btn">Bag</button>
   <button className="btn--secondary">Sign UP</button>

</div>


      </div>

       </div> 
    )
}