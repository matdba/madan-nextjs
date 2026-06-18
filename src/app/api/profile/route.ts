import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { BackendError } from "@/lib/backend/backend-error";
import { backendFetch } from "@/lib/backend/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { getToken } from "next-auth/jwt";
import { ProfileSchema } from "@/lib/schemas/profile.schema";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!session && !token?.accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const raw = await backendFetch("/profile", {
      method: "GET",
      token: token?.accessToken,
    });

    if (!raw) return NextResponse.json("");

    const result = ProfileSchema.parse(raw);
    return NextResponse.json(result);
  } catch (err) {
    console.error("profile error:", err);
    if (err instanceof ZodError) {
      return NextResponse.json({ error: `Invalid input: ${err}` }, { status: 400 });
    }
    if (err instanceof BackendError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!session && !token?.accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const raw = await backendFetch("/profile", {
      method: "PUT",
      token: token?.accessToken,
      body: JSON.stringify(body),
    });

    if (!raw) return NextResponse.json("");

    return NextResponse.json(raw);
  } catch (err) {
    console.error("profile update error:", err);
    if (err instanceof ZodError) {
      return NextResponse.json({ error: `Invalid input: ${err}` }, { status: 400 });
    }
    if (err instanceof BackendError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
  }
}
