import { NextResponse, NextRequest } from "next/server";
import { ZodError, z } from "zod";
import { BackendError } from "@/lib/backend/backend-error";
import { backendFetch } from "@/lib/backend/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { getToken } from "next-auth/jwt";
import { GetNotifiedListSchema } from "@/lib/schemas/get-notified.schema";

const AddLetMeKnowRequestSchema = z.object({
  mobile_number: z.string().min(1),
  truck_id: z.number().int(),
  loading_city_id: z.number().int(),
  discharging_city_id: z.number().int(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const session = await getServerSession(authOptions);
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    console.log(token);

    if (!session && !token?.accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const raw = await backendFetch("/company/let-me-knows", {
      method: "GET",
      token: token?.accessToken,
      params: Object.fromEntries(searchParams),
    });

    if (!raw) {
      return NextResponse.json("");
    }

    const result = GetNotifiedListSchema.parse(raw);
    return NextResponse.json(result);
  } catch (err) {
    console.error("get-notified error:", err);
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
    const data = AddLetMeKnowRequestSchema.parse(body);

    const raw = await backendFetch("/company/let-me-knows", {
      method: "POST",
      token: token?.accessToken,
      body: JSON.stringify({ ...data }),
    });

    if (!raw) {
      return NextResponse.json("");
    }

    return NextResponse.json(raw);
  } catch (err) {
    console.error("add let-me-know ERROR:", err);

    if (err instanceof ZodError) {
      return NextResponse.json({ error: `Invalid input: ${err}` }, { status: 400 });
    }

    if (err instanceof BackendError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
  }
}
