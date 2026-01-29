'use client';

import { Copy, Check, Landmark } from 'lucide-react';
import { useState } from 'react';

export default function BankDetails({ orderId }: { orderId: string }) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const bankInfo = {
    bankName: 'Хаан Банк',
    ibanNumber: 'MN05000500',
    accountNumber: '5076609279',
    accountName: 'Э .Бэрхбат',

    description: orderId,
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="overflow-hidden rounded-3xl border-2 border-rose-100 bg-rose-50/30 p-6 ring-1 ring-rose-200">
      <div className="mb-4 flex items-center gap-2 font-black tracking-tight text-gray-900 uppercase">
        <Landmark size={20} className="text-rose-600" />
        <span>Төлбөр шилжүүлэх</span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-gray-50 bg-white p-4 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase">Банк</p>
          <p className="text-sm font-bold text-gray-800">{bankInfo.bankName}</p>
        </div>

        <div className="rounded-2xl border border-gray-50 bg-white p-4 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase">
            Хүлээн авагч
          </p>
          <p className="text-sm font-bold text-gray-800">
            {bankInfo.accountName}
          </p>
        </div>

        <button
          onClick={() => copyToClipboard(bankInfo.ibanNumber, 'iban')}
          className="group relative flex flex-col items-start rounded-2xl border border-gray-50 bg-white p-4 text-left shadow-sm transition-all hover:border-rose-200 active:scale-95"
        >
          <p className="text-[10px] font-bold text-gray-400 uppercase">
            IBAN дугаар
          </p>
          <div className="flex w-full items-center justify-between">
            <p className="text-sm font-black text-rose-600">
              {bankInfo.ibanNumber}
            </p>
            {copiedField === 'iban' ? (
              <Check size={14} className="text-green-500" />
            ) : (
              <Copy
                size={14}
                className="text-gray-300 group-hover:text-rose-400"
              />
            )}
          </div>
          {copiedField === 'iban' && (
            <span className="absolute -top-2 right-2 animate-bounce rounded bg-green-500 px-2 py-0.5 text-[10px] text-white">
              Хуулагдлаа!
            </span>
          )}
        </button>

        <button
          onClick={() => copyToClipboard(bankInfo.accountNumber, 'account')}
          className="group relative flex flex-col items-start rounded-2xl border border-gray-50 bg-white p-4 text-left shadow-sm transition-all hover:border-rose-200 active:scale-95"
        >
          <p className="text-[10px] font-bold text-gray-400 uppercase">
            Дансны дугаар
          </p>
          <div className="flex w-full items-center justify-between">
            <p className="text-sm font-black text-rose-600">
              {bankInfo.accountNumber}
            </p>
            {copiedField === 'account' ? (
              <Check size={14} className="text-green-500" />
            ) : (
              <Copy
                size={14}
                className="text-gray-300 group-hover:text-rose-400"
              />
            )}
          </div>
          {copiedField === 'account' && (
            <span className="absolute -top-2 right-2 animate-bounce rounded bg-green-500 px-2 py-0.5 text-[10px] text-white">
              Хуулагдлаа!
            </span>
          )}
        </button>

        <button
          onClick={() => copyToClipboard(bankInfo.description, 'desc')}
          className="group relative flex flex-col items-start rounded-2xl border-2 border-rose-200 bg-white p-4 text-left shadow-sm transition-all hover:bg-rose-50 active:scale-95"
        >
          <p className="text-[10px] font-bold text-rose-400 uppercase">
            Гүйлгээний утга
          </p>
          <div className="flex w-full items-center justify-between">
            <p className="text-sm font-black text-gray-900">
              {bankInfo.description}
            </p>
            {copiedField === 'desc' ? (
              <Check size={14} className="text-green-500" />
            ) : (
              <Copy
                size={14}
                className="text-gray-300 group-hover:text-rose-400"
              />
            )}
          </div>
          {copiedField === 'desc' && (
            <span className="absolute -top-2 right-2 animate-bounce rounded bg-green-500 px-2 py-0.5 text-[10px] text-white">
              Хуулагдлаа!
            </span>
          )}
        </button>
      </div>

      <div className="mt-4 rounded-xl border border-rose-100/50 bg-white/50 p-3 text-[11px] leading-relaxed text-gray-500">
        <span className="mr-1 font-bold text-rose-600 uppercase">Санамж:</span>
        Дээрх дансны дугаар болон гүйлгээний утга дээр дарж шууд хуулж авна уу.
        Төлбөр шилжүүлснээс хойш 15-30 минутын дараа таны захиалга
        &quot;Баталгаажсан&quot; төлөвт шилжих болно.
      </div>
    </div>
  );
}
