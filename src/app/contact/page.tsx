import React from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

type SvgProps = React.SVGProps<SVGSVGElement>;
const SocialIcons = {
  Facebook: (props: SvgProps) => (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  ),
  Instagram: (props: SvgProps) => (
    <svg
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      {...props}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  ),
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white pt-24 pb-16 text-gray-900">
      <div className="container mx-auto max-w-5xl px-6">
        <div className="mb-16 text-center">
          <h1 className="mb-4 font-serif text-4xl font-bold tracking-tight text-gray-950">
            Холбоо барих
          </h1>
          <div className="mx-auto mb-6 h-px w-12 bg-amber-500"></div>
          <p className="mx-auto max-w-md text-sm leading-relaxed text-gray-500">
            Бид таны асуултад хариулж, зөвлөгөө өгөхдөө таатай байх болно.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col items-center rounded-2xl bg-gray-50 p-8 text-center transition-shadow hover:shadow-lg">
            <div className="mb-6 rounded-full bg-white p-4">
              <Phone className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="mb-2 text-xs font-bold tracking-widest text-gray-400 uppercase">
              Утас
            </h3>
            <p className="text-base font-medium">+976 9402-9797</p>
            <p className="mt-1 text-xs text-gray-400">
              Ажлын цагаар залгана уу
            </p>
          </div>

          <div className="flex flex-col items-center rounded-2xl bg-gray-50 p-8 text-center transition-shadow hover:shadow-lg">
            <div className="mb-6 rounded-full bg-white p-4">
              <Mail className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="mb-2 text-xs font-bold tracking-widest text-gray-400 uppercase">
              И-мэйл
            </h3>
            <p className="text-base font-medium">berhee14@gmail.com</p>
            <p className="mt-1 text-xs text-gray-400">
              24 цагийн дотор хариулна
            </p>
          </div>

          <div className="flex flex-col items-center rounded-2xl bg-gray-50 p-8 text-center transition-shadow hover:shadow-lg">
            <div className="mb-6 rounded-full bg-white p-4">
              <MapPin className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="mb-2 text-xs font-bold tracking-widest text-gray-400 uppercase">
              Хаяг
            </h3>
            <p className="text-base font-medium">
              УБ хот, Банязүрх дүүрэг 25 - хороо натур
            </p>
            <p className="mt-1 text-xs text-gray-400">Төв салбар</p>
          </div>

          <div className="flex flex-col items-center rounded-2xl bg-gray-50 p-8 text-center transition-shadow hover:shadow-lg">
            <div className="mb-6 rounded-full bg-white p-4">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="mb-2 text-xs font-bold tracking-widest text-gray-400 uppercase">
              Цагийн хуваарь
            </h3>
            <p className="text-base font-medium">10:00 - 19:00</p>
            <p className="mt-1 text-xs text-gray-400">Даваа - Баасан</p>
          </div>
        </div>

        <div className="mt-16 rounded-3xl bg-gray-950 p-12 text-center text-white">
          <h2 className="mb-6 font-serif text-2xl">
            Олон нийтийн сүлжээгээр холбогдох
          </h2>
          <div className="flex justify-center gap-8">
            <a
              href="https://www.instagram.com/berh.bat  "
              className="group flex flex-col items-center gap-3"
            >
              <div className="rounded-full bg-white/10 p-4 transition-colors group-hover:bg-amber-500">
                <SocialIcons.Instagram className="h-6 w-6" />
              </div>
              <span className="text-xs tracking-widest text-gray-400 uppercase">
                Instagram
              </span>
            </a>
            <a
              href="https://www.facebook.com/enkhbold.berhee"
              className="group flex flex-col items-center gap-3"
            >
              <div className="rounded-full bg-white/10 p-4 transition-colors group-hover:bg-amber-500">
                <SocialIcons.Facebook className="h-6 w-6" />
              </div>
              <span className="text-xs tracking-widest text-gray-400 uppercase">
                Facebook
              </span>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
