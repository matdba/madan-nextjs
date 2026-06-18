import { NextResponse, NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { BackendError } from '@/lib/backend/backend-error';
import { backendFetch } from '@/lib/backend/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { getToken } from "next-auth/jwt";
import { AddMachineryRequestSchema } from '@/lib/schemas/machinery.schema';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!session && !token?.accessToken) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const data = AddMachineryRequestSchema.parse(body);

    const raw = await backendFetch('/machinery/add', {
      method: 'POST',
      token: token?.accessToken,
      body: JSON.stringify(data),
    });

    if (!raw) {
      return NextResponse.json('');
    }

    return NextResponse.json(raw);
  } catch (err) {
    console.error('add machinery error:', err);
    if (err instanceof ZodError) {
      return NextResponse.json({ error: `Invalid input: ${err}` }, { status: 400 });
    }
    if (err instanceof BackendError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    return NextResponse.json({ error: 'خطا در افزودن ماشین‌آلات' }, { status: 500 });
  }
}
