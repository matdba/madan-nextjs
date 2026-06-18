import { z } from "zod";

export const PermissionItemSchema = z.object({
  PermissionID: z.number().catch(0),
  PermissionKey: z.string().catch(""),
  PermissionName: z.string().catch(""),
});

export const PermissionListSchema = z.object({
  list: z.array(PermissionItemSchema).catch([]),
  status: z.string().catch(""),
});

export type PermissionItemType = z.infer<typeof PermissionItemSchema>;
export type PermissionListResponse = z.infer<typeof PermissionListSchema>;

export const AddPermissionRequestSchema = z.object({
  PermissionKey: z.string(),
  PermissionName: z.string(),
});

export type AddPermissionRequestType = z.infer<typeof AddPermissionRequestSchema>;

export const EditPermissionRequestSchema = z.object({
  PermissionID: z.number(),
  PermissionKey: z.string(),
  PermissionName: z.string(),
});

export type EditPermissionRequestType = z.infer<typeof EditPermissionRequestSchema>;

export const DeletePermissionRequestSchema = z.object({
  PermissionID: z.number(),
});

export type DeletePermissionRequestType = z.infer<typeof DeletePermissionRequestSchema>;
