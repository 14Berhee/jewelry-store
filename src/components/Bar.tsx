import { ShieldCheck, CreditCard, Truck } from 'lucide-react';

const FEATURES = [
  {
    title: 'Чанартай, баталгаат үнэт эдлэл',
    icon: <ShieldCheck className="h-4 w-4" />,
  },
  {
    title: 'Аюулгүй онлайн төлбөр',
    icon: <CreditCard className="h-4 w-4" />,
  },
  {
    title: 'Шуурхай, найдвартай хүргэлт',
    icon: <Truck className="h-4 w-4" />,
  },
];

export default function TrustBar() {
  return (
    <section className="border-y border-[#eaddcf] bg-[#fdfaf5] py-5">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-start justify-center gap-y-4 sm:flex-row sm:items-center sm:gap-x-8 md:gap-x-12">
          {FEATURES.map((feature, index) => (
            <div
              key={index}
              className="flex w-full items-center justify-start gap-3 sm:w-auto"
            >
              <div className="flex shrink-0 items-center justify-center rounded-full bg-[#f4ece1] p-2 text-[#a68b6d]">
                {feature.icon}
              </div>

              <p className="text-xs font-medium tracking-tight text-stone-700 sm:text-sm">
                {feature.title}
              </p>

              {index !== FEATURES.length - 1 && (
                <div className="absolute right-0 bottom-[-8px] left-0 h-[1px] bg-[#eaddcf]/50 sm:hidden" />
              )}

              {index !== FEATURES.length - 1 && (
                <div className="hidden h-4 w-px bg-[#eaddcf] sm:ml-8 sm:block md:ml-12" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
