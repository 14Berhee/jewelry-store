// app/api/auth/logout/route.ts
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();

    // Delete the token cookie
    cookieStore.delete('token');

    return Response.json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    return Response.json({ message: 'Logout failed' }, { status: 500 });
  }
}
