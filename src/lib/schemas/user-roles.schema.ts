import { z } from "zod";

export const UserGetRolesRequestSchema = z.object({
  UserID: z.union([z.string(), z.number()]),
});

export type UserGetRolesRequestType = z.infer<typeof UserGetRolesRequestSchema>;

export const UserGetRolesResponseSchema = z.object({
  status: z.string().catch(""),
  RoleIDs: z.array(z.number()).catch([]),
});

export type UserGetRolesResponseType = z.infer<typeof UserGetRolesResponseSchema>;

export const UserSetRolesRequestSchema = z.object({
  UserID: z.union([z.string(), z.number()]),
  RoleIDs: z.array(z.number()),
});

export type UserSetRolesRequestType = z.infer<typeof UserSetRolesRequestSchema>;
