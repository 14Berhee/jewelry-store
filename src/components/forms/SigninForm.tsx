'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useActionState, useEffect, Suspense } from 'react';
import { loginUserAction } from '../../app/data/actions/auth';
import { Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import LumeLogo from '../LumeLogo';

function SigninFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formState, formAction, isPending] = useActionState(
    loginUserAction,
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
    <div className="flex min-h-screen items-center justify-center bg-[#F9F7F2] px-4 py-12 selection:bg-[#C5A358]/20">
      <div className="grid w-full max-w-6xl items-center gap-16 lg:grid-cols-2">
        <div className="animate-in fade-in slide-in-from-left-8 hidden flex-col justify-center space-y-12 px-8 duration-1000 ease-out lg:flex">
          <div className="space-y-6">
            <div className="animate-in fade-in zoom-in-95 fill-mode-both flex items-center gap-3 delay-300 duration-700">
              <div className="h-[1px] w-12 bg-[#C5A358]" />
              <span className="text-[10px] font-bold tracking-[0.3em] text-[#C5A358] uppercase">
                Est. 2025
              </span>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both delay-150 duration-1000">
              <div className="w-56 scale-110 lg:w-72">
                <LumeLogo />
              </div>
            </div>

            <p className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both max-w-md text-lg leading-relaxed font-light text-stone-600 delay-300 duration-1000">
              Чанар болон үнэ цэнийн төгс зохицол. Таны дотоод гоо үзэсгэлэнг
              гэрэлтүүлэх нандин урлал.
            </p>
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both grid gap-8 delay-500 duration-1000">
            {[
              {
                title: 'Баталгаат материал',
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
              <div key={index} className="group flex items-start gap-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-stone-200 bg-white transition-all duration-500 group-hover:border-[#C5A358] group-hover:bg-[#C5A358]/5">
                  <CheckCircle2 className="h-4 w-4 text-[#C5A358]" />
                </div>
                <div>
                  <div className="font-medium tracking-wide text-stone-800">
                    {item.title}
                  </div>
                  <div className="text-sm font-light text-stone-500">
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="animate-in fade-in zoom-in-95 slide-in-from-right-8 relative mx-auto w-full max-w-md duration-1000 ease-out lg:mx-0">
          <div className="absolute -inset-4 z-0 animate-pulse rounded-[3rem] bg-gradient-to-tr from-[#C5A358]/10 via-transparent to-transparent blur-2xl duration-[4000ms]" />

          <form
            action={formAction}
            className="relative z-10 transition-transform duration-500 hover:scale-[1.005]"
          >
            <div className="space-y-8 rounded-[2.5rem] border border-white bg-white/80 p-10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] backdrop-blur-xl lg:p-14">
              <div className="space-y-3">
                <h2 className="font-serif text-4xl font-light text-stone-900">
                  Нэвтрэх
                </h2>
                <div className="h-0.5 w-8 bg-[#C5A358] transition-all duration-700 group-focus-within:w-16" />
                <p className="text-sm font-light text-stone-500">
                  Lume-ийн ертөнцөд дахин тавтай морил
                </p>
              </div>

              <div className="space-y-5">
                <div className="animate-in fade-in slide-in-from-bottom-2 fill-mode-both space-y-2 delay-[700ms] duration-700">
                  <Label
                    htmlFor="identifier"
                    className="ml-1 text-[10px] font-bold tracking-widest text-stone-400 uppercase"
                  >
                    Хэрэглэгчийн мэдээлэл
                  </Label>
                  <Input
                    id="identifier"
                    name="identifier"
                    type="text"
                    required
                    placeholder="И-мэйл эсвэл нэр"
                    className="h-14 rounded-2xl border-stone-100 bg-stone-50/50 px-6 transition-all duration-300 placeholder:font-light focus:border-[#C5A358] focus:bg-white focus:ring-0"
                  />
                </div>

                <div className="animate-in fade-in slide-in-from-bottom-2 fill-mode-both space-y-2 delay-[800ms] duration-700">
                  <div className="flex items-center justify-between px-1">
                    <Label
                      htmlFor="password"
                      className="text-[10px] font-bold tracking-widest text-stone-400 uppercase"
                    >
                      Нууц үг
                    </Label>
                    <Link
                      href="/forgot-password"
                      className="text-[10px] font-bold tracking-widest text-[#C5A358] uppercase transition-opacity hover:opacity-70"
                    >
                      Мартсан уу?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    className="h-14 rounded-2xl border-stone-100 bg-stone-50/50 px-6 transition-all duration-300 focus:border-[#C5A358] focus:bg-white focus:ring-0"
                  />
                </div>

                {formState?.message && (
                  <div className="animate-in fade-in zoom-in-95 rounded-xl border border-red-100 bg-red-50/50 p-4 text-center text-xs font-medium text-red-600 duration-300">
                    {formState.message}
                  </div>
                )}
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="group relative h-14 w-full overflow-hidden rounded-2xl bg-stone-900 text-sm font-bold tracking-widest text-white transition-all duration-500 hover:bg-stone-800 hover:shadow-lg active:scale-[0.98]"
              >
                <div className="relative z-10 flex items-center justify-center gap-2">
                  {isPending ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                      <span>БОЛОВСРУУЛЖ БАЙНА</span>
                    </>
                  ) : (
                    <>
                      <span>НЭВТРЭХ</span>
                      <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
                    </>
                  )}
                </div>
              </Button>

              <div className="animate-in fade-in fill-mode-both pt-4 text-center delay-[1100ms]">
                <p className="text-xs font-light text-stone-500">
                  Бүртгэлгүй юу?{' '}
                  <Link
                    href={`/signup${searchParams.get('redirect') ? `?redirect=${searchParams.get('redirect')}` : ''}`}
                    className="ml-1 font-bold text-[#C5A358] transition-colors duration-300 hover:text-stone-900"
                  >
                    Шинээр бүртгүүлэх
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

export function SigninForm() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#F9F7F2]">
          <div className="flex h-12 w-12 animate-pulse items-center justify-center rounded-full border border-[#C5A358]/20">
            <div className="h-2 w-2 rounded-full bg-[#C5A358]" />
          </div>
        </div>
      }
    >
      <SigninFormContent />
    </Suspense>
  );
}
