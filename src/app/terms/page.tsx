import React from 'react';
import { Scale, ShoppingBag, CreditCard, AlertTriangle } from 'lucide-react';

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-white pt-24 pb-16 text-gray-900">
      <div className="container mx-auto max-w-4xl px-6">
        <div className="mb-12 border-b border-gray-100 pb-10">
          <h1 className="mb-4 font-serif text-4xl font-bold tracking-tight text-gray-950">
            Үйлчилгээний нөхцөл
          </h1>
          <p className="text-[10px] tracking-widest text-gray-500 uppercase">
            Сүүлд шинэчилсэн: 2026 оны 1-р сар
          </p>
        </div>

        <div className="space-y-12 text-sm leading-relaxed text-gray-600">
          <section>
            <div className="mb-4 flex items-center gap-3 text-gray-950">
              <Scale className="h-5 w-5 text-amber-600" />
              <h2 className="font-bold tracking-wider uppercase">
                1. Ерөнхий нөхцөл
              </h2>
            </div>
            <p>
              Энэхүү вэбсайтыг ашигласнаар та манай үйлчилгээний нөхцөлийг бүрэн
              хүлээн зөвшөөрч байна гэж үзнэ. LUME нь нөхцөлүүдийг ямар ч үед
              шинэчлэх эрхтэй бөгөөд хэрэглэгч та өөрчлөлтүүдийг тухай бүрт нь
              шалгаж байх үүрэгтэй.
            </p>
          </section>

          <section className="grid grid-cols-1 gap-8 rounded-2xl border border-gray-100 bg-gray-50 p-8 md:grid-cols-2">
            <div>
              <div className="mb-4 flex items-center gap-3 text-gray-950">
                <ShoppingBag className="h-5 w-5 text-amber-600" />
                <h2 className="text-xs font-bold tracking-wider uppercase">
                  Захиалга ба Үнэ
                </h2>
              </div>
              <p className="text-xs leading-relaxed">
                Бүтээгдэхүүний үнэ болон бэлэн байгаа эсэх нь урьдчилан
                мэдэгдэлгүйгээр өөрчлөгдөж болно. Бид алдаатай үнээр хийгдсэн
                захиалгыг цуцлах эрхтэй.
              </p>
            </div>
            <div>
              <div className="mb-4 flex items-center gap-3 text-gray-950">
                <CreditCard className="h-5 w-5 text-amber-600" />
                <h2 className="text-xs font-bold tracking-wider uppercase">
                  Төлбөр тооцоо
                </h2>
              </div>
              <p className="text-xs leading-relaxed">
                Та захиалга хийхдээ төлбөрийг бүрэн шилжүүлснээр захиалга
                баталгаажна. Бид банкны шилжүүлэг болон цахим картын
                төлбөрүүдийг хүлээн авна.
              </p>
            </div>
          </section>

          <section>
            <div className="mb-4 flex items-center gap-3 text-gray-950">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <h2 className="font-bold tracking-wider uppercase">
                2. Хариуцлагын хязгаарлалт
              </h2>
            </div>
            <p className="mb-4 text-gray-600">
              Манай бүтээгдэхүүнийг зориулалтын дагуу бус ашигласан, буруу
              арчилснаас үүдэн гарсан хохиролд LUME хариуцлага хүлээхгүй. Алт,
              мөнгөн эдлэлийн арчилгааны заавартай заавал танилцана уу.
            </p>
            <div className="border-l-4 border-red-500 bg-red-50 p-4">
              <p className="mb-1 font-semibold text-red-900">Санамж:</p>
              <p className="text-xs text-red-800">
                Буцаалтыг бараа хүлээн авснаас хойш 72 цагийн дотор хийнэ. Пайз
                болон лац салсан тохиолдолд буцаалт хийх боломжгүйг анхаарна уу.
              </p>
            </div>
          </section>

          <section>
            <div className="mb-4 flex items-center gap-3 text-gray-950">
              <h2 className="font-bold tracking-wider uppercase">
                3. Оюуны өмч
              </h2>
            </div>
            <p>
              Вэбсайт дээрх бүх зураг, лого, текстүүд нь LUME-ийн өмч бөгөөд
              зөвшөөрөлгүйгээр хуулбарлах, арилжааны зорилгоор ашиглахыг
              хориглоно.
            </p>
          </section>

          <section className="border-t border-gray-100 pt-8 text-center">
            <p className="text-xs text-gray-400">
              Танд нөхцөлүүдтэй холбоотой асуулт байвал манай хэрэглэгчийн
              үйлчилгээтэй холбогдоорой.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
