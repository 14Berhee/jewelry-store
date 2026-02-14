'use client';

import { AlertCircle, Copy, Search } from 'lucide-react';
import Link from 'next/link';

export default function GuestLinkNotice() {
  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Линк хуулагдлаа!');
  };

  return (
    <div className="mb-8 rounded-2xl border border-blue-100 bg-blue-50/50 p-5 ring-1 ring-blue-200/50">
      <div className="flex items-start gap-3">
        <AlertCircle size={20} className="mt-0.5 shrink-0 text-blue-600" />
        <div className="flex-1">
          <h4 className="text-sm font-bold text-blue-900">
            Захиалгаа хэрхэн хянах вэ?
          </h4>
          <p className="mt-1 text-xs leading-relaxed text-blue-700">
            Та зочноор захиалга өгсөн тул энэ хуудасны линкийг хадгалж авах
            эсвэл манай{' '}
            <strong className="font-black underline">
              &quot;Захиалага хянах&quot;
            </strong>{' '}
            цэсээр орж өөрийн утасны дугаараар шалгах боломжтой.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={copyLink}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-blue-700"
            >
              <Copy size={14} />
              ХОЛБООС ХУУЛАХ
            </button>

            <Link
              href="/track-order"
              className="flex items-center gap-2 rounded-lg border border-blue-200 bg-white px-3 py-2 text-xs font-bold text-blue-600 transition-colors hover:bg-blue-50"
            >
              <Search size={14} />
              ЗАХИАЛГА ХЯНАХ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
