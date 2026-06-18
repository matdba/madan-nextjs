import { NextRequest, NextResponse } from "next/server";
import { ZodError, z } from "zod";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { BackendError } from "@/lib/backend/backend-error";
import { backendFetch } from "@/lib/backend/client";
import { authOptions } from "../../auth/[...nextauth]/route";

const SendSmsRequestSchema = z.object({
  drivers_ids: z.array(z.number().int().positive()).min(1),
  message: z.string().trim().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!session && !token?.accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const payload = SendSmsRequestSchema.parse(body);

    const raw = await backendFetch("/company/drivers/send-sms", {
      method: "POST",
      token: token?.accessToken,
      body: JSON.stringify(payload),
    });

    if (!raw) return NextResponse.json("");

    return NextResponse.json(raw);
  } catch (err) {
    console.error("send sms error:", err);
    if (err instanceof ZodError) {
      return NextResponse.json({ error: `Invalid input: ${err}` }, { status: 400 });
    }
    if (err instanceof BackendError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
  }
}
