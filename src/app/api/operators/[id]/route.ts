import { NextResponse, NextRequest } from "next/server";
import { ZodError } from "zod";
import { BackendError } from "@/lib/backend/backend-error";
import { backendFetch } from "@/lib/backend/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getToken } from "next-auth/jwt";
import { OperatorDetailsSchema } from "@/lib/schemas/operators.schema";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const { id } = await params;

    if (!session && !token?.accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const raw = await backendFetch(`/company/operators/${id}`, {
      method: "GET",
      token: token?.accessToken,
    });

    if (!raw) {
      return NextResponse.json("");
    }

    const result = OperatorDetailsSchema.parse(raw);
    return NextResponse.json(result);
  } catch (err) {
    console.error("operator detail error:", err);
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
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const { id } = await params;

    if (!session && !token?.accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const raw = await backendFetch(`/company/operators/${id}`, {
      method: "DELETE",
      token: token?.accessToken,
    });

    if (!raw) {
      return NextResponse.json("");
    }

    return NextResponse.json(raw);
  } catch (err) {
    console.error("delete operator error:", err);
    if (err instanceof ZodError) {
      return NextResponse.json({ error: `Invalid input: ${err}` }, { status: 400 });
    }

    if (err instanceof BackendError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
  }
}
