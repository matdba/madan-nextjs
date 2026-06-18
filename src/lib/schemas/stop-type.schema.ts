import { z } from "zod";

// The backend list returns a direct array. Field names are uncertain, so we
// accept several casings and passthrough.
export const StopTypeListItemSchema = z
	.object({
		StopTypeID: z.number().optional(),
		TypeID: z.number().optional(),
		ID: z.number().optional(),
		id: z.number().optional(),
		StopTypeName: z.string().nullable().optional(),
		name: z.string().nullable().optional(),
		Name: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		Description: z.string().nullable().optional(),
	})
	.passthrough();

export type StopTypeListItem = z.infer<typeof StopTypeListItemSchema>;

export const StopTypeListSchema = z.array(StopTypeListItemSchema).catch([]);

export const AddStopTypeRequestSchema = z.object({
	name: z.string(),
	description: z.string(),
});

export type AddStopTypeRequestType = z.infer<typeof AddStopTypeRequestSchema>;

export const UpdateStopTypeRequestSchema = AddStopTypeRequestSchema;
export type UpdateStopTypeRequestType = z.infer<typeof UpdateStopTypeRequestSchema>;
