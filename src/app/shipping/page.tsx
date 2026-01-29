import React from 'react';
import { Truck, Clock, Package } from 'lucide-react';

export default function ShippingReturnsPage() {
  return (
    <main className="min-h-screen bg-white pt-24 pb-16 text-gray-900">
      <div className="container mx-auto max-w-4xl px-6">
        <div className="mb-12 border-b border-gray-100 pb-10">
          <h1 className="mb-4 font-serif text-4xl font-bold tracking-tight text-gray-950">
            Хүргэлт болон Буцаалт
          </h1>
          <p className="text-xs tracking-widest text-gray-500 uppercase">
            Бид танд хамгийн чанартай үйлчилгээг амлаж байна
          </p>
        </div>

        <div className="space-y-16">
          <section className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="md:col-span-1">
              <div className="mb-2 flex items-center gap-2">
                <Truck className="h-5 w-5 text-amber-600" />
                <h2 className="text-sm font-semibold tracking-wider uppercase">
                  Хүргэлт
                </h2>
              </div>
            </div>
            <div className="text-sm leading-relaxed text-gray-600 md:col-span-2">
              <p className="mb-4 font-medium text-gray-800">
                Захиалга бүрийг гараар нямбай савлаж, найдвартай хүргэж өгнө.
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Улаанбаатар хот дотор хүргэлт 24-48 цагийн дотор хийгдэнэ.
                </li>
                <li>
                  Орон нутгийн хүргэлтийг Монгол Шуудан болон ачаа тээврээр
                  илгээнэ.
                </li>
              </ul>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-8 rounded-lg border border-amber-100/50 bg-amber-50/50 p-8 md:grid-cols-3">
            <div className="md:col-span-1">
              <div className="mb-2 flex items-center gap-2 text-amber-900">
                <Clock className="h-5 w-5" />
                <h2 className="text-sm font-semibold tracking-wider uppercase">
                  Буцаалт
                </h2>
              </div>
            </div>
            <div className="text-sm leading-relaxed text-gray-700 md:col-span-2">
              <p className="mb-2 font-bold text-gray-950 underline decoration-amber-500 underline-offset-4">
                3 Хоногийн Буцаалтын Бодлого
              </p>
              <p className="mb-4">
                Манай гоёл чимэглэлийн онцгой байдлыг хадгалах үүднээс бид маш
                хатуу
                <strong> 3 хоногийн буцаалтын хугацаа</strong> баримталдаг.
              </p>
              <p className="mb-4">
                Та барааг хүлээн авснаас хойш{' '}
                <strong>72 цагийн (3 хоног)</strong> дотор буцаалт хийх хүсэлтээ
                гаргасан байх ёстой.
              </p>
              <div className="rounded border border-amber-200 bg-white p-4 text-xs">
                <p className="mb-1 font-semibold tracking-tighter text-gray-500 uppercase">
                  Тавигдах шаардлага:
                </p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>Бүтээгдэхүүний лац болон пайз салсан байж болохгүй.</li>
                  <li>
                    Зүүсэн, хэмжээг нь өөрчилсөн эсвэл гэмтээсэн тохиолдолд
                    буцаах боломжгүй.
                  </li>
                  <li>
                    Анхны хайрцаг, баглаа боодол болон гэрчилгээг бүрэн байх
                    шаардлагатай.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="md:col-span-1">
              <div className="mb-2 flex items-center gap-2">
                <Package className="h-5 w-5 text-amber-600" />
                <h2 className="text-sm font-semibold tracking-wider uppercase">
                  Хэрхэн буцаах вэ?
                </h2>
              </div>
            </div>
            <div className="text-sm text-gray-600 md:col-span-2">
              <ol className="list-decimal space-y-4 pl-5">
                <li>Манай и-мэйл эсвэл утсаар 3 хоногийн дотор холбогдоно.</li>
                <li>
                  Буцаалтын зөвшөөрөл авсны дараа барааг манай дэлгүүрт хүргэж
                  өгнө.
                </li>
                <li>
                  Барааг шалгаж дууссаны дараа таны төлбөр 48 цагийн дотор
                  буцаан шилжигдэнэ.
                </li>
              </ol>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
