import { z } from "zod";

// The backend list returns a direct array. Field names are uncertain, so we
// accept several casings and passthrough.
export const ActivityTypeListItemSchema = z
	.object({
		ActivityTypeID: z.number().optional(),
		TypeID: z.number().optional(),
		ID: z.number().optional(),
		id: z.number().optional(),
		ActivityTypeName: z.string().nullable().optional(),
		ActivityName: z.string().nullable().optional(),
		name: z.string().nullable().optional(),
		Name: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		Description: z.string().nullable().optional(),
	})
	.passthrough();

export type ActivityTypeListItem = z.infer<typeof ActivityTypeListItemSchema>;

// The backend may return a direct array or wrap it as { data: [...], status }.
export const ActivityTypeListSchema = z
	.union([
		z.array(ActivityTypeListItemSchema),
		z.object({ data: z.array(ActivityTypeListItemSchema) }).transform((o) => o.data),
	])
	.catch([]);

export const AddActivityTypeRequestSchema = z.object({
	name: z.string(),
	description: z.string(),
});

export type AddActivityTypeRequestType = z.infer<typeof AddActivityTypeRequestSchema>;

export const UpdateActivityTypeRequestSchema = AddActivityTypeRequestSchema;
export type UpdateActivityTypeRequestType = z.infer<typeof UpdateActivityTypeRequestSchema>;
