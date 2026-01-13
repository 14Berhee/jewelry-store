'use client';

export default function BackButton() {
  return (
    <button
      onClick={() => window.history.back()}
      className="inline-block rounded-full bg-neutral-900 px-6 py-3 font-medium text-white transition hover:bg-neutral-700"
    >
      Буцах
    </button>
  );
}
