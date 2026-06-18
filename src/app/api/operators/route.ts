import { NextResponse, NextRequest } from "next/server";
import { ZodError } from "zod";
import { BackendError } from "@/lib/backend/backend-error";
import { backendFetch } from "@/lib/backend/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { getToken } from "next-auth/jwt";
import { AddOperatorRequestSchema, OperatorsListSchema } from "@/lib/schemas/operators.schema";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const session = await getServerSession(authOptions);
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    console.log('tokne', token);

    if (!session && !token?.accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const raw = await backendFetch("/company/operators/", {
      method: "GET",
      token: token?.accessToken,
      params: Object.fromEntries(searchParams),
    });

    if (!raw) {
      return NextResponse.json("");
    }

    const result = OperatorsListSchema.parse(raw);
    return NextResponse.json(result);
  } catch (err) {
    console.error("operators error:", err);
    if (err instanceof ZodError) {
      return NextResponse.json({ error: `Invalid input: ${err}` }, { status: 400 });
    }

    if (err instanceof BackendError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!session && !token?.accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = AddOperatorRequestSchema.parse(body);

    const raw = await backendFetch("/company/operators/", {
      method: "POST",
      token: token?.accessToken,
      body: JSON.stringify({ ...data }),
    });

    if (!raw) {
      return NextResponse.json("");
    }

    return NextResponse.json(raw);
  } catch (err) {
    console.error("add operator ERROR:", err);

    if (err instanceof ZodError) {
      return NextResponse.json({ error: `Invalid input: ${err}` }, { status: 400 });
    }

    if (err instanceof BackendError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
  }
}
