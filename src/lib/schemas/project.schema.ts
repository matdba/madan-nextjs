import { z } from "zod";

// The backend list returns { list: [...], status } (or possibly a direct array).
// Field names beyond the documented ones are uncertain, so we accept several
// casings and passthrough.
export const ProjectListItemSchema = z
	.object({
		ProjectID: z.number().optional(),
		ProjectTitle: z.string().nullable().optional(),
		title: z.string().nullable().optional(),
		Title: z.string().nullable().optional(),
		ProjectManagerID: z.union([z.string(), z.number()]).nullable().optional(),
		manager: z.union([z.string(), z.number()]).nullable().optional(),
		ProjectManagerName: z.string().nullable().optional(),
		Status: z.string().nullable().optional(),
		status: z.string().nullable().optional(),
		StartDate: z.string().nullable().optional(),
		start: z.string().nullable().optional(),
		EndDate: z.string().nullable().optional(),
		end: z.string().nullable().optional(),
		Description: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
	})
	.passthrough();

export type ProjectListItem = z.infer<typeof ProjectListItemSchema>;

export const ProjectListSchema = z
	.union([
		z.array(ProjectListItemSchema),
		z.object({ list: z.array(ProjectListItemSchema) }).transform((o) => o.list),
		z.object({ data: z.array(ProjectListItemSchema) }).transform((o) => o.data),
	])
	.catch([]);

export const AddProjectRequestSchema = z.object({
	title: z.string(),
	manager: z.union([z.string(), z.number()]).nullable(),
	status: z.string(),
	start: z.string(),
	end: z.string().nullable(),
	description: z.string(),
});

export type AddProjectRequestType = z.infer<typeof AddProjectRequestSchema>;

export const UpdateProjectRequestSchema = AddProjectRequestSchema;
export type UpdateProjectRequestType = z.infer<typeof UpdateProjectRequestSchema>;
