import { NextResponse, NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { BackendError } from '@/lib/backend/backend-error';
import { backendFetch } from '@/lib/backend/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { getToken } from "next-auth/jwt";
import { MachineryListSchema } from '@/lib/schemas/machinery.schema';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!session && !token?.accessToken) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const raw = await backendFetch('/machinery/list', {
      method: 'GET',
      token: token?.accessToken,
    });

    if (!raw) {
      return NextResponse.json([]);
    }

    const result = MachineryListSchema.parse(raw);
    return NextResponse.json(result);
  } catch (err) {
    console.error('machinery error:', err);
    if (err instanceof ZodError) {
      return NextResponse.json({ error: `Invalid input: ${err}` }, { status: 400 });
    }
    if (err instanceof BackendError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    return NextResponse.json({ error: 'خطا در دریافت اطلاعات' }, { status: 500 });
  }
}
