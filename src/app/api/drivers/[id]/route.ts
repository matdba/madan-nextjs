import { NextResponse, NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { BackendError } from '@/lib/backend/backend-error';
import { backendFetch } from '@/lib/backend/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { getToken } from "next-auth/jwt";
import { DriverDetailsSchema } from '@/lib/schemas/driver-details.schema';


export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET, });
        const { id } = await params;

        if (!session && !token?.accessToken) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const raw = await backendFetch(`/company/drivers/${id}`, {
            method: 'GET',
            token: token?.accessToken,
        });

        if (!raw) return NextResponse.json('');

        const result = DriverDetailsSchema.parse(raw);
        return NextResponse.json(result);
    } catch (err) {
        console.error('dashboard error:', err);
        if (err instanceof ZodError) {
            return NextResponse.json({ error: `Invalid input: ${err}` }, { status: 400 });
        }

        if (err instanceof BackendError) {
            return NextResponse.json({ error: err.message }, { status: err.status });
        }
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET, });
        const { id } = await params;

        if (!session && !token?.accessToken) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const raw = await backendFetch(`/company/drivers/delete-driver/${id}`, {
            method: 'DELETE',
            token: token?.accessToken,
        });

        if (!raw) return NextResponse.json('');

        return NextResponse.json(raw);
    } catch (err) {
        console.error('DELETE DRIVER ERROR:', err);

        if (err instanceof ZodError) {
            return NextResponse.json({ error: `Invalid input: ${err}` }, { status: 400 });
        }

        if (err instanceof BackendError) {
            return NextResponse.json({ error: err.message }, { status: err.status });
        }
    }
}
