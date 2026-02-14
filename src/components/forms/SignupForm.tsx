'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useActionState, useEffect, Suspense } from 'react';
import { registerUserAction } from '../../app/data/actions/auth';
import { Sparkles, CheckCircle2 } from 'lucide-react';

function SignupFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formState, formAction, isPending] = useActionState(
    registerUserAction,
    {}
  );

  useEffect(() => {
    if (formState?.success && formState.data) {
      const redirect = searchParams.get('redirect');

      router.refresh();

      if (formState.data.role === 'admin') {
        router.push('/admin');
      } else if (redirect) {
        router.push(redirect);
      } else {
        router.push('/');
      }
    }
  }, [formState, router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FDFBF7] px-4 py-12">
      <div className="grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div className="hidden flex-col justify-center space-y-8 px-8 lg:flex">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#C5A358]">
              <Sparkles className="h-6 w-6" />
              <span className="text-sm font-bold tracking-widest uppercase">
                Тансаг зэрэглэлийн сонголт
              </span>
            </div>
            <h1 className="text-6xl font-black tracking-tighter text-gray-900">
              LUME
            </h1>
            <p className="text-xl text-gray-600/80">
              Өнөөдөр бидэнтэй нэгдэж, таны гоо үзэсгэлэнг тодорхойлох нандин
              цуглуулгуудтай танилцаарай.
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                title: 'Баталгаат материалууд',
                desc: '100% сорьцтой алт болон мөнгө',
              },
              {
                title: 'Үнэгүй хүргэлт',
                desc: 'Улаанбаатар хот болон орон нутагт',
              },
              {
                title: 'Аюулгүй төлбөр тооцоо',
                desc: 'Таны мэдээлэл хамгаалагдсан',
              },
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center text-[#C5A358]">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-bold text-gray-800">{item.title}</div>
                  <div className="text-sm text-gray-500">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Signup Form */}
        <div className="mx-auto w-full max-w-md lg:mx-0">
          <div className="mb-8 text-center lg:hidden">
            <Link href="/">
              <h1 className="text-3xl font-black text-gray-900">My Jewelry</h1>
            </Link>
            <p className="mt-2 text-gray-500">
              Шинэ бүртгэл үүсгэж, бидэнтэй нэгдээрэй.
            </p>
          </div>

          <form action={formAction}>
            <div className="space-y-6 rounded-[2rem] border border-stone-100 bg-white p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] lg:p-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-gray-900">
                  Бүртгүүлэх
                </h2>
                <p className="text-sm text-gray-500">
                  Мэдээллээ оруулж шинэ бүртгэл үүсгэнэ үү.
                </p>
              </div>

              <div className="space-y-4">
                {/* Username */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="username"
                    className="text-xs font-bold tracking-wider text-gray-600 uppercase"
                  >
                    Хэрэглэгчийн нэр
                  </Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    required
                    placeholder="Жишээ: Bat123"
                    className="h-12 border-stone-200 bg-stone-50/30 focus:border-[#C5A358] focus:ring-[#C5A358]"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="email"
                    className="text-xs font-bold tracking-wider text-gray-600 uppercase"
                  >
                    И-мэйл хаяг
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="example@mail.com"
                    className="h-12 border-stone-200 bg-stone-50/30 focus:border-[#C5A358] focus:ring-[#C5A358]"
                  />
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="password"
                    className="text-xs font-bold tracking-wider text-gray-600 uppercase"
                  >
                    Нууц үг
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    className="h-12 border-stone-200 bg-stone-50/30 focus:border-[#C5A358] focus:ring-[#C5A358]"
                  />
                </div>

                {/* Messages */}
                {formState?.message && (
                  <div
                    className={`animate-in fade-in slide-in-from-top-1 rounded-xl border p-3 text-center text-xs font-medium ${
                      formState.success
                        ? 'border-green-100 bg-green-50 text-green-600'
                        : 'border-red-100 bg-red-50 text-red-600'
                    }`}
                  >
                    {formState.message}
                  </div>
                )}
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="h-12 w-full rounded-xl bg-[#1a1a1a] text-sm font-bold text-white transition-all hover:bg-black active:scale-[0.98]"
              >
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Бүртгэж байна...
                  </div>
                ) : (
                  'Бүртгүүлэх'
                )}
              </Button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-stone-100" />
                </div>
                <div className="relative flex justify-center text-[10px] font-bold tracking-widest text-stone-400 uppercase">
                  <span className="bg-white px-4">Эсвэл</span>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-500">
                  Бүртгэлтэй юу?{' '}
                  <Link
                    href={`/signin${searchParams.get('redirect') ? `?redirect=${searchParams.get('redirect')}` : ''}`}
                    className="font-bold text-[#C5A358] transition-colors hover:text-[#A68945]"
                  >
                    Нэвтрэх
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export function SignupForm() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#FDFBF7]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-stone-200 border-t-[#C5A358]" />
        </div>
      }
    >
      <SignupFormContent />
    </Suspense>
  );
}
