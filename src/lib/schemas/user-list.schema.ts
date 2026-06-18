import { z } from "zod";

export const UserItemSchema = z.object({
  CreatAt: z.string().catch(""),
  IsActive: z.number().catch(0),
  Name: z.string().catch(""),
  UserID: z.string().catch(""),
  UserPhoneNumber: z.string().catch(""),
});

export const UserListSchema = z.object({
  list: z.array(UserItemSchema).catch([]),
  status: z.string().catch(""),
});

export type UserItemType = z.infer<typeof UserItemSchema>;
export type UserListResponse = z.infer<typeof UserListSchema>;

export const AddUserRequestSchema = z.object({
  UserID: z.union([z.string(), z.number()]),
  UserPass: z.string(),
  Name: z.string(),
  UserPhoneNumber: z.string(),
  IsActive: z.number(),
});

export type AddUserRequestType = z.infer<typeof AddUserRequestSchema>;

export const EditUserRequestSchema = z.object({
  UserID: z.union([z.string(), z.number()]),
  Name: z.string(),
  UserPhoneNumber: z.string(),
  IsActive: z.number(),
});

export type EditUserRequestType = z.infer<typeof EditUserRequestSchema>;

export const DeleteUserRequestSchema = z.object({
  UserID: z.union([z.string(), z.number()]),
});

export type DeleteUserRequestType = z.infer<typeof DeleteUserRequestSchema>;
