import { backendFetch } from '@/lib/backend/client';
import {
  SendOtpSchema,
  VerifyOtpSchema,
  SendOtpResponseSchema,
  VerifyOtpResponseSchema,
} from '@/lib/schemas/auth.schema';

export async function sendOtp(input: unknown) {
  const data = SendOtpSchema.parse(input);

  const raw = await backendFetch('/auth/send-otp', {
    method: 'POST',
    body: JSON.stringify({
      mobile_number: data.phoneNumber, // map to backend format
    }),
  });

  console.log('raw', raw);

  return SendOtpResponseSchema.parse(raw);
}

export async function verifyOtp(input: unknown) {
  console.log('INPUT', input);

  const data = VerifyOtpSchema.parse(input);


  const raw = await backendFetch('/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify({
      mobile_number: data.phoneNumber,
      code: data.code,
      role: 'transportation_company'
    }),
  });

  console.log('raw', raw);


  return VerifyOtpResponseSchema.parse(raw);
}
