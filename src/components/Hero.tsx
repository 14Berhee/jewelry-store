export default function Hero() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-24 text-center">
      <h1 className="mb-6 font-serif text-4xl md:text-5xl">
        Fine Gold & Silver Jewelry
      </h1>
      <p className="mb-10 text-lg text-neutral-600">
        Crafted to last. Designed to shine.
      </p>
      <div className="flex justify-center gap-4">
        <button className="rounded-full bg-neutral-900 px-8 py-3 text-white transition hover:bg-neutral-800">
          Shop Rings
        </button>
        <button className="rounded-full border border-neutral-300 px-8 py-3 transition hover:border-neutral-900">
          Shop Chains
        </button>
      </div>
    </section>
  );
}
