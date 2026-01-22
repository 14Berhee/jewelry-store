'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useActionState } from 'react';
import { requestPasswordResetAction } from '../../app/data/actions/auth';

export function ForgotPasswordForm() {
  const [formState, formAction, isPending] = useActionState(
    requestPasswordResetAction,
    { success: false, message: '' }
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-50 via-white to-rose-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <h1 className="mb-2 text-3xl font-bold text-gray-800">
              My Jewelry
            </h1>
          </Link>
          <p className="text-gray-600">
            Нууц үгээ мартсан уу? Имэйл хаягаа оруулна уу
          </p>
        </div>

        <form action={formAction}>
          <div className="space-y-6 rounded-2xl border border-gray-100 bg-white p-8 shadow-2xl">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-800">
                Нууц үг сэргээх
              </h2>
              <p className="text-sm text-gray-600">
                Таны имэйл рүү нууц үг сэргээх холбоос илгээх болно
              </p>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  И-мэйл хаяг
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="example@email.com"
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

              {/* Success Message */}
              {formState?.message && formState.success && (
                <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                  <p className="text-center text-sm text-green-600">
                    {formState.message}
                  </p>
                  <p className="mt-2 text-center text-xs text-gray-600">
                    Имэйлээ шалгана уу (spam фолдер орно)
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
                  Илгээж байна...
                </span>
              ) : formState?.success ? (
                'Илгээгдсэн ✓'
              ) : (
                'Холбоос илгээх'
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
