import { NextResponse } from 'next/server';
import { sendOtp } from '@/lib/services/auth.service';
import { ZodError } from 'zod';
import { BackendError } from '@/lib/backend/backend-error';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await sendOtp(body);

    return NextResponse.json(result);
  } catch (err) {
    console.error('send-otp error:', err);
    if (err instanceof ZodError) {
      return NextResponse.json({ error: `Invalid input: ${err}` }, { status: 400 });
    }

    if (err instanceof BackendError) {
      const message = typeof err.message === 'string' ? err.message : 'خطا در ارسال کد';
      return NextResponse.json({ error: message }, { status: err.status });
    }
  }
}
