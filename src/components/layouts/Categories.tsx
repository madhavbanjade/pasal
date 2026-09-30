import CategoryCard from "../ui/CategoryCard";

export default function Categories() {
  return (
    <section className="w-full py-10 sm:px-6">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <CategoryCard
          title="Men's clothing"
          productCount={4}
          startingPrice={15.99}
          image="/mens.png"
          href="/category/men"
        />

        <CategoryCard
          title="Women's clothing"
          productCount={4}
          startingPrice={12.99}
          image="/women.jpg"
          href="/category/women"
        />

        <CategoryCard
          title="Jewellery"
          productCount={4}
          startingPrice={9.99}
          image="/jewellery.jpg"
          href="/category/jewellery"
        />

        <CategoryCard
          title="Electronics"
          productCount={6}
          startingPrice={29.99}
          image="/electronics.jpg"
          href="/category/electronics"
        />
      </div>
    </section>
  );
}
