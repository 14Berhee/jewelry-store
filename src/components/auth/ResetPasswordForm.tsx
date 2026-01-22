'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useActionState, useEffect, Suspense } from 'react';
import { resetPasswordAction } from '../../app/data/actions/auth';

function ResetPasswordFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [formState, formAction, isPending] = useActionState(
    resetPasswordAction,
    { success: false, message: '' }
  );

  useEffect(() => {
    if (formState?.success && formState.data) {
      setTimeout(() => {
        if (formState.data?.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/');
        }
      }, 2000);
    }
  }, [formState, router]);

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-50 via-white to-rose-50 px-4 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-red-200 bg-white p-8 shadow-2xl">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <span className="text-2xl text-red-500">✕</span>
              </div>
              <h2 className="mb-2 text-xl font-bold text-gray-800">
                Буруу холбоос
              </h2>
              <p className="mb-6 text-gray-600">
                Нууц үг сэргээх холбоос олдсонгүй эсвэл буруу байна
              </p>
              <Link
                href="/forgot-password"
                className="text-pink-500 hover:text-pink-600"
              >
                Дахин оролдох →
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-50 via-white to-rose-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <h1 className="mb-2 text-3xl font-bold text-gray-800">
              My Jewelry
            </h1>
          </Link>
          <p className="text-gray-600">Шинэ нууц үг үүсгэнэ үү</p>
        </div>

        <form action={formAction}>
          <input type="hidden" name="token" value={token} />

          <div className="space-y-6 rounded-2xl border border-gray-100 bg-white p-8 shadow-2xl">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-800">Шинэ нууц үг</h2>
              <p className="text-sm text-gray-600">
                Хамгийн багадаа 6 тэмдэгт ашиглана уу
              </p>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Нууц үг
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="h-12 border-gray-300 text-base focus:border-pink-500 focus:ring-pink-500"
                  disabled={isPending || formState?.success}
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-gray-700"
                >
                  Нууц үг давтах
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className="h-12 border-gray-300 text-base focus:border-pink-500 focus:ring-pink-500"
                  disabled={isPending || formState?.success}
                />
              </div>

              {formState?.message && !formState.success && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                  <p className="text-center text-sm text-red-600">
                    {formState.message}
                  </p>
                </div>
              )}

              {formState?.message && formState.success && (
                <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                  <p className="text-center text-sm text-green-600">
                    {formState.message}
                  </p>
                  <p className="mt-2 text-center text-xs text-gray-600">
                    Та автоматаар нэвтэрлээ. Хуудас шилжиж байна...
                  </p>
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={isPending || formState?.success}
              className="h-12 w-full rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 text-base font-semibold text-white shadow-md transition-all duration-200 hover:from-pink-600 hover:to-rose-600 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Солиж байна...
                </span>
              ) : formState?.success ? (
                'Амжилттай ✓'
              ) : (
                'Нууц үг солих'
              )}
            </Button>

            <div className="text-center">
              <Link
                href="/signin"
                className="text-sm font-semibold text-pink-500 transition-colors hover:text-pink-600"
              >
                ← Нэвтрэх хуудас руу буцах
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export function ResetPasswordForm() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-pink-500"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <ResetPasswordFormContent />
    </Suspense>
  );
}
