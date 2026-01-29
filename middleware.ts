import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const token = req.cookies.get('token')?.value;
  console.log('==============================');
  console.log('MIDDLEWARE PATH:', path);
  console.log('TOKEN EXISTS:', !!token);
  console.log('JWT_SECRET EXISTS:', !!process.env.JWT_SECRET);

  const checkoutRoutes = ['/checkout'];
  const dashboardRoutes = ['/dashboard', '/dashboard/:path*'];
  const adminRoutes = ['/admin', '/admin/:path*'];

  if (!token) {
    if (checkoutRoutes.some((r) => path.startsWith(r))) {
      const url = new URL('/signin', req.url);
      url.searchParams.set('redirect', path);
      return NextResponse.redirect(url);
    }

    if (
      [...dashboardRoutes, ...adminRoutes].some((r) =>
        path.startsWith(r.replace(':path*', ''))
      )
    ) {
      return NextResponse.redirect(new URL('/signin', req.url));
    }

    return NextResponse.next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
      role: string;
    };

    if (
      adminRoutes.some((r) => path.startsWith(r.replace(':path*', ''))) &&
      decoded.role !== 'ADMIN'
    ) {
      return NextResponse.redirect(new URL('/signin', req.url));
    }

    if (
      dashboardRoutes.some((r) => path.startsWith(r.replace(':path*', ''))) &&
      decoded.role !== 'ADMIN' &&
      decoded.role !== 'USER'
    ) {
      return NextResponse.redirect(new URL('/signin', req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('JWT Error:', error);
    return NextResponse.redirect(new URL('/signin', req.url));
  }
}

export const config = {
  matcher: ['/checkout', '/dashboard/:path*', '/admin/:path*'],
};
