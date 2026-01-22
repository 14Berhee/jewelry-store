'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useActionState, useEffect, Suspense } from 'react';
import { registerUserAction } from '../../app/data/actions/auth';

function SignupFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formState, formAction, isPending] = useActionState(
    registerUserAction,
    {}
  );

  useEffect(() => {
    if (formState?.success && formState.data) {
      // Get redirect parameter from URL
      const redirect = searchParams.get('redirect');

      console.log('Signup successful, redirect param:', redirect);
      console.log('User role:', formState.data.role);

      if (formState.data.role === 'admin') {
        router.push('/admin');
      } else if (redirect) {
        // Redirect to the saved URL
        console.log('Redirecting to:', redirect);
        router.push(redirect);
      } else {
        // Fallback to home
        console.log('No redirect, going to home');
        router.push('/');
      }
    }
  }, [formState, router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-50 via-white to-rose-50 px-4 py-12">
      <div className="grid w-full max-w-6xl items-center gap-8 lg:grid-cols-2">
        {/* Left Side - Branding/Image */}
        <div className="hidden flex-col justify-center space-y-6 px-8 lg:flex">
          <div>
            <h1 className="mb-4 text-5xl font-bold text-gray-800">
              My Jewelry
            </h1>
            <p className="mb-8 text-xl text-gray-600">
              Fine Gold & Silver Jewelry
            </p>
            <p className="leading-relaxed text-gray-500">
              Join us today and discover our collection of premium jewelry
              pieces that tell your story.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-100 text-xl text-pink-500">
                ✓
              </div>
              <div>
                <div className="font-semibold text-gray-800">
                  Certified Materials
                </div>
                <div className="text-sm text-gray-600">
                  100% authentic gold and silver
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-100 text-xl text-pink-500">
                ✓
              </div>
              <div>
                <div className="font-semibold text-gray-800">Free Shipping</div>
                <div className="text-sm text-gray-600">
                  On all orders nationwide
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-100 text-xl text-pink-500">
                ✓
              </div>
              <div>
                <div className="font-semibold text-gray-800">
                  Secure Payments
                </div>
                <div className="text-sm text-gray-600">
                  Your data is always protected
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-md lg:mx-0">
          <div className="mb-8 text-center lg:hidden">
            <Link href="/" className="inline-block">
              <h1 className="mb-2 text-3xl font-bold text-gray-800">
                My Jewelry
              </h1>
            </Link>
            <p className="text-gray-600">Create your account to get started</p>
          </div>

          <form action={formAction}>
            <div className="space-y-6 rounded-2xl border border-gray-100 bg-white p-8 shadow-2xl lg:p-10">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-gray-800">Бүртгүүлэх</h2>
                <p className="text-gray-600">
                  Бүртгүүлэхийн тулд мэдээллээ оруулна уу
                </p>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <Label
                    htmlFor="username"
                    className="text-sm font-medium text-gray-700"
                  >
                    Хэрэглэгчийн нэр
                  </Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Хэрэглэгчийн нэр оруулна уу"
                    className="h-12 border-gray-300 text-base focus:border-pink-500 focus:ring-pink-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    И-мэйл
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="И-мэйл хаяг оруулна уу"
                    className="h-12 border-gray-300 text-base focus:border-pink-500 focus:ring-pink-500"
                  />
                </div>

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
                    placeholder="Нууц үгээ оруулна уу"
                    className="h-12 border-gray-300 text-base focus:border-pink-500 focus:ring-pink-500"
                  />
                </div>

                {/* Error Message */}
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
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isPending}
                className="h-12 w-full rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 text-base font-semibold text-white shadow-md transition-all duration-200 hover:from-pink-600 hover:to-rose-600 hover:shadow-lg"
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
                    Бүртгэж байна...
                  </span>
                ) : (
                  'Бүртгүүлэх'
                )}
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-4 text-gray-500">or</span>
                </div>
              </div>

              {/* Sign In Link */}
              <div className="text-center">
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <Link
                    href={`/signin${searchParams.get('redirect') ? `?redirect=${searchParams.get('redirect')}` : ''}`}
                    className="font-semibold text-pink-500 transition-colors hover:text-pink-600"
                  >
                    Sign In
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
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-pink-500"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <SignupFormContent />
    </Suspense>
  );
}
