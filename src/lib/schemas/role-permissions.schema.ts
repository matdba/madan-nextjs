import { z } from "zod";

export const RoleGetPermissionsRequestSchema = z.object({
  RoleID: z.number(),
});

export type RoleGetPermissionsRequestType = z.infer<typeof RoleGetPermissionsRequestSchema>;

export const RoleGetPermissionsResponseSchema = z.object({
  status: z.string().catch(""),
  PermissionIDs: z.array(z.number()).catch([]),
});

export type RoleGetPermissionsResponseType = z.infer<typeof RoleGetPermissionsResponseSchema>;

export const RoleSetPermissionsRequestSchema = z.object({
  RoleID: z.number(),
  PermissionIDs: z.array(z.number()),
});

export type RoleSetPermissionsRequestType = z.infer<typeof RoleSetPermissionsRequestSchema>;
