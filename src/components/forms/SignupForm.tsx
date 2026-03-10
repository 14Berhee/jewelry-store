'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useActionState, useEffect, Suspense } from 'react';
import { registerUserAction } from '../../app/data/actions/auth';
import { Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import LumeLogo from '../LumeLogo';

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
    <div className="flex min-h-screen items-center justify-center bg-[#F9F7F2] px-4 py-12 selection:bg-[#C5A358]/20">
      <div className="grid w-full max-w-6xl items-center gap-16 lg:grid-cols-2">
        <div className="animate-in fade-in slide-in-from-left-8 hidden flex-col justify-center space-y-12 px-8 duration-1000 ease-out lg:flex">
          <div className="space-y-6">
            <div className="animate-in fade-in zoom-in-95 fill-mode-both flex items-center gap-3 delay-300 duration-700">
              <div className="h-[1px] w-12 bg-[#C5A358]" />
              <span className="text-[10px] font-bold tracking-[0.3em] text-[#C5A358] uppercase">
                Тансаг зэрэглэлийн сонголт
              </span>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both delay-150 duration-1000">
              <div className="w-56 scale-110 lg:w-72">
                <LumeLogo />
              </div>
            </div>

            <p className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both max-w-md text-lg leading-relaxed font-light text-stone-600 delay-300 duration-1000">
              Өнөөдөр бидэнтэй нэгдэж, таны гоо үзэсгэлэнг тодорхойлох нандин
              цуглуулгуудтай танилцаарай.
            </p>
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both grid gap-8 delay-500 duration-1000">
            {[
              {
                title: 'Насан туршийн үнэ цэнэ',
                desc: 'Үе дамжин дамжигдах чанар болон загвар',
              },
              {
                title: 'Хязгаарлагдмал цуглуулга',
                desc: 'Дахин давтагдашгүй цөөн тооны загварууд',
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
          <div className="absolute -inset-4 z-0 animate-pulse rounded-[3rem] bg-gradient-to-br from-[#C5A358]/10 via-transparent to-transparent blur-2xl duration-[4000ms]" />

          <form
            action={formAction}
            className="relative z-10 transition-transform duration-500 hover:scale-[1.005]"
          >
            <div className="space-y-8 rounded-[2.5rem] border border-white bg-white/80 p-10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] backdrop-blur-xl lg:p-14">
              <div className="space-y-3">
                <h2 className="font-serif text-4xl font-light text-stone-900">
                  Бүртгүүлэх
                </h2>
                <div className="h-0.5 w-8 bg-[#C5A358] transition-all duration-700 group-focus-within:w-16" />
                <p className="text-sm font-light text-stone-500">
                  Мэдээллээ оруулж шинэ бүртгэл үүсгэнэ үү.
                </p>
              </div>

              <div className="space-y-5">
                {[
                  {
                    id: 'username',
                    label: 'Хэрэглэгчийн нэр',
                    type: 'text',
                    placeholder: 'Жишээ: Bat123',
                  },
                  {
                    id: 'email',
                    label: 'И-мэйл хаяг',
                    type: 'email',
                    placeholder: 'example@mail.com',
                  },
                  {
                    id: 'password',
                    label: 'Нууц үг',
                    type: 'password',
                    placeholder: '••••••••',
                  },
                ].map((input, i) => (
                  <div
                    key={input.id}
                    className={`animate-in fade-in slide-in-from-bottom-2 fill-mode-both space-y-2 duration-700 delay-[${700 + i * 100}ms]`}
                  >
                    <Label
                      htmlFor={input.id}
                      className="ml-1 text-[10px] font-bold tracking-widest text-stone-400 uppercase"
                    >
                      {input.label}
                    </Label>
                    <Input
                      id={input.id}
                      name={input.id}
                      type={input.type}
                      required
                      placeholder={input.placeholder}
                      className="h-14 rounded-2xl border-stone-100 bg-stone-50/50 px-6 transition-all duration-300 placeholder:font-light focus:border-[#C5A358] focus:bg-white focus:ring-0"
                    />
                  </div>
                ))}

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
                      <span>БҮРТГҮҮЛЭХ</span>
                      <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
                    </>
                  )}
                </div>
              </Button>

              <div className="animate-in fade-in fill-mode-both pt-4 text-center delay-[1200ms]">
                <p className="text-xs font-light text-stone-500">
                  Бүртгэлтэй юу?{' '}
                  <Link
                    href="/signin"
                    className="ml-1 font-bold text-[#C5A358] transition-colors duration-300 hover:text-stone-900"
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
        <div className="flex min-h-screen items-center justify-center bg-[#F9F7F2]">
          <div className="flex h-12 w-12 animate-pulse items-center justify-center rounded-full border border-[#C5A358]/20">
            <div className="h-2 w-2 rounded-full bg-[#C5A358]" />
          </div>
        </div>
      }
    >
      <SignupFormContent />
    </Suspense>
  );
}
