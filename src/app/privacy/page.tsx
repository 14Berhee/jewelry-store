import React from 'react';
import { ShieldCheck, Eye, Lock, FileText } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-white pt-24 pb-16 text-gray-900">
      <div className="container mx-auto max-w-4xl px-6">
        <div className="mb-12 border-b border-gray-100 pb-10">
          <h1 className="mb-4 font-serif text-4xl font-bold tracking-tight text-gray-950">
            Нууцлалын бодлого
          </h1>
          <p className="text-[10px] tracking-widest text-gray-500 uppercase">
            Сүүлд шинэчилсэн: 2026 оны 1-р сар
          </p>
        </div>

        <div className="space-y-12 text-sm leading-relaxed text-gray-600">
          <section>
            <div className="mb-4 flex items-center gap-3 text-gray-950">
              <ShieldCheck className="h-5 w-5 text-amber-600" />
              <h2 className="font-bold tracking-wider uppercase">
                Ерөнхий заалт
              </h2>
            </div>
            <p>
              LUME нь таны хувийн мэдээллийн нууцлалыг чандлан хадгалахыг нэн
              тэргүүний зорилго болгон ажилладаг. Энэхүү баримт бичиг нь таныг
              манай вэбсайтаар үйлчлүүлэх үед бид ямар мэдээлэл цуглуулдаг,
              түүнийг хэрхэн ашигладаг болохыг тайлбарлана.
            </p>
          </section>

          <section className="grid grid-cols-1 gap-8 rounded-2xl border border-gray-100 bg-gray-50 p-8 md:grid-cols-2">
            <div>
              <div className="mb-4 flex items-center gap-3 text-gray-950">
                <Eye className="h-5 w-5 text-amber-600" />
                <h2 className="font-bold tracking-wider uppercase">
                  Цуглуулах мэдээлэл
                </h2>
              </div>
              <ul className="list-disc space-y-2 pl-5">
                <li>Овог нэр, холбоо барих утас</li>
                <li>Хүргэлтийн хаяг</li>
                <li>Цахим шуудан (E-mail)</li>
                <li>Худалдан авалтын түүх</li>
              </ul>
            </div>
            <div>
              <div className="mb-4 flex items-center gap-3 text-gray-950">
                <Lock className="h-5 w-5 text-amber-600" />
                <h2 className="font-bold tracking-wider uppercase">
                  Ашиглах зорилго
                </h2>
              </div>
              <ul className="list-disc space-y-2 pl-5">
                <li>Захиалга баталгаажуулалт</li>
                <li>Хүргэлт зохион байгуулах</li>
                <li>Шинэ бүтээгдэхүүний мэдээлэл хүргэх</li>
                <li>Үйлчилгээг сайжруулах</li>
              </ul>
            </div>
          </section>

          <section>
            <div className="mb-4 flex items-center gap-3 text-gray-950">
              <FileText className="h-5 w-5 text-amber-600" />
              <h2 className="font-bold tracking-wider uppercase">
                Мэдээллийн хамгаалалт
              </h2>
            </div>
            <p className="mb-4">
              Бид таны мэдээллийг гуравдагч этгээдэд худалдахгүй, түрээслэхгүй
              бөгөөд зөвхөн хүргэлтийн үйлчилгээ үзүүлэгч байгууллагад
              шаардлагатай мэдээллийг (хаяг, утас) дамжуулна. Таны төлбөрийн
              картын мэдээлэл манай системд хадгалагдахгүй, банкны хамгаалалттай
              системээр шууд дамждаг болно.
            </p>
            <div className="border-l-4 border-amber-500 bg-amber-50 p-4">
              <p className="font-medium text-amber-900">
                Та хэдийд ч өөрийн мэдээллээ шинэчлэх, эсвэл системээс устгах
                хүсэлт гаргах эрхтэй.
              </p>
            </div>
          </section>

          <section className="border-t border-gray-100 pt-8">
            <h2 className="mb-4 font-bold tracking-wider text-gray-950 uppercase">
              Холбоо барих
            </h2>
            <p>
              Нууцлалын бодлоготой холбоотой асуулт байвал{' '}
              <span className="font-medium text-amber-600">
                berhee14@gmail.com
              </span>{' '}
              хаягаар бидэнд хандана уу.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
