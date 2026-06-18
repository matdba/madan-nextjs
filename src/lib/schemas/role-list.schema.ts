import { z } from "zod";

export const RoleItemSchema = z.object({
  RoleID: z.number().catch(0),
  RoleName: z.string().catch(""),
  RoleDescription: z.string().catch(""),
});

export const RoleListSchema = z.object({
  list: z.array(RoleItemSchema).catch([]),
  status: z.string().catch(""),
});

export type RoleItemType = z.infer<typeof RoleItemSchema>;
export type RoleListResponse = z.infer<typeof RoleListSchema>;

export const AddRoleRequestSchema = z.object({
  RoleName: z.string(),
  RoleDescription: z.string(),
});

export type AddRoleRequestType = z.infer<typeof AddRoleRequestSchema>;

export const EditRoleRequestSchema = z.object({
  RoleID: z.number(),
  RoleName: z.string(),
  RoleDescription: z.string(),
});

export type EditRoleRequestType = z.infer<typeof EditRoleRequestSchema>;

export const DeleteRoleRequestSchema = z.object({
  RoleID: z.number(),
});

export type DeleteRoleRequestType = z.infer<typeof DeleteRoleRequestSchema>;
