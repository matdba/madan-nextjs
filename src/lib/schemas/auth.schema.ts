import { z } from 'zod';

export const SendOtpSchema = z.object({
  phoneNumber: z.string().min(11).max(11),
});

export const VerifyOtpSchema = z.object({
  phoneNumber: z.string().min(11).max(11),
  code: z.string().length(4), // or 5/6 based on your backend
});

export const SendOtpResponseSchema = z.object({
  result: z.boolean(),
  message: z.string(),
  data: z.object({
    new_user: z.boolean(),
    isTransportationCompany: z.boolean(),
    result: z.boolean(),
  })
});

export const VerifyOtpResponseSchema = z.object({
  result: z.boolean().optional(),
  message: z.string().optional(),
  data: z.object({
    token: z.string(),
  }),
});

export const LoginCredentialsSchema = z.object({
  userId: z.string().min(1),
  password: z.string().min(1),
});

export const LoginResponseSchema = z.object({
  UserID: z.string(),
  UserToken: z.string(),
  permissions: z.array(z.string()).default([]),
  status: z.string(),
});

export type LoginUserData = Omit<z.infer<typeof LoginResponseSchema>, "UserToken">;
