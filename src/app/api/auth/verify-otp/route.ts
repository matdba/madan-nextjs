import { NextResponse } from 'next/server';
import { verifyOtp } from '@/lib/services/auth.service';
import { ZodError } from 'zod';
import { BackendError } from '@/lib/backend/backend-error';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await verifyOtp(body);

    /**
     * IMPORTANT:
     * Here is where BFF shines:
     * - You can store tokens in HttpOnly cookies
     * - Or integrate with NextAuth
     */

    const res = NextResponse.json({
      token: result.data.token,
    });

    // Example: store access token securely
    res.cookies.set('access_token', result.data.token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
    });

    return res;
  } catch (err) {
    console.error('verify-otp error:', err);

    if (err instanceof ZodError) {
      return NextResponse.json({ error: `Invalid input: ${err}`}, { status: 400 });
    }

    if (err instanceof BackendError) {
      const message = typeof err?.message === 'string' ? err.message : 'خطا در احراز هویت';
      return NextResponse.json({ error: message }, { status: err.status });
    }

  }
}
