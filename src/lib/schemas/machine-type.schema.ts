import { z } from "zod";

// The backend list returns a direct array. Field names beyond the documented
// ones are uncertain, so we accept several casings and passthrough.
export const MachineTypeListItemSchema = z
	.object({
		TypeID: z.number().catch(0),
		MachineTypeName: z.string().optional(),
		name: z.string().optional(),
		Name: z.string().optional(),
		category: z.string().optional(),
		Category: z.string().optional(),
		MachineCategory: z.string().nullable().optional(),
		manufacturer: z.string().optional(),
		Manufacturer: z.string().nullable().optional(),
		model: z.string().optional(),
		Model: z.string().nullable().optional(),
		service_hours: z.number().optional(),
		ServiceHours: z.number().optional(),
		StandardServiceHours: z.number().nullable().optional(),
		description: z.string().optional(),
		Description: z.string().optional(),
	})
	.passthrough();

export type MachineTypeListItem = z.infer<typeof MachineTypeListItemSchema>;

export const MachineTypeListSchema = z.array(MachineTypeListItemSchema).catch([]);

export const AddMachineTypeRequestSchema = z.object({
	name: z.string(),
	category: z.string(),
	manufacturer: z.string(),
	model: z.string(),
	service_hours: z.number(),
	description: z.string(),
});

export type AddMachineTypeRequestType = z.infer<typeof AddMachineTypeRequestSchema>;

export const UpdateMachineTypeRequestSchema = AddMachineTypeRequestSchema;
export type UpdateMachineTypeRequestType = z.infer<typeof UpdateMachineTypeRequestSchema>;
