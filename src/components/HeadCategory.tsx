type ProductCategory = {
  id: number;
  name: string;
  slug: string;
  imageUrl: string;
};

export default function HeadCategory({
  category,
}: {
  category: ProductCategory[];
}) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <h1 className="mb-10 text-lg text-neutral-600">Shop by categories</h1>

      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {category.map((category) => (
          <div
            key={category.id}
            className="group cursor-pointer rounded-2xl border border-neutral-200 p-6 transition hover:shadow-md"
          >
            <img
              src={category.imageUrl}
              alt={category.name}
              className="mb-4 aspect-square rounded-xl bg-neutral-100"
            />
            <h3 className="text-center font-medium group-hover:underline">
              {category.name}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
}
