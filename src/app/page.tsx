import Categories from "../components/layouts/Categories";
import Hero from "../components/layouts/Hero";
import { fetchAPI } from "../services/api.service";
import { Product } from "../types";


const PICKS = [16, 14, 2, 7];
async function fetchProducts(): Promise<Product[]>{
  const res = await fetchAPI({ endPoint: "products"});
  const data =  res?.data ?? [];
 console.log(data);
 return data;

  
}
export default async function Home() {
  const all = await fetchProducts();
   const product = PICKS.map((id) => all.find((p) => p.id === id)).filter(
    (p): p is Product => Boolean(p)
  );

return(
  <div className="container">
   <Hero products={product} />
   <Categories />
  </div>
)
}
