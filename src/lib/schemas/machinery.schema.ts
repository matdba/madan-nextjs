import { z } from "zod";

// The backend list returns a direct array. Field names beyond the documented
// ones are uncertain, so we accept several casings and passthrough.
export const MachineryListItemSchema = z
	.object({
		MachineryID: z.number().catch(0),
		TypeID: z.number().optional(),
		MachineTypeName: z.string().optional(),
		NumberPlate: z.string().nullable().optional(),
		plate: z.string().optional(),
		Plate: z.string().optional(),
		serial: z.string().optional(),
		Serial: z.string().optional(),
		SerialNumber: z.string().nullable().optional(),
		year: z.number().optional(),
		Year: z.number().optional(),
		ManufactureYear: z.number().nullable().optional(),
		start_date: z.string().optional(),
		StartDate: z.string().optional(),
		StartWorkDate: z.string().nullable().optional(),
		ownership: z.string().optional(),
		Ownership: z.string().nullable().optional(),
		status: z.union([z.string(), z.number()]).optional(),
		Status: z.union([z.string(), z.number()]).optional(),
		description: z.string().optional(),
		Description: z.string().optional(),
	})
	.passthrough();

export type MachineryListItem = z.infer<typeof MachineryListItemSchema>;

export const MachineryListSchema = z.array(MachineryListItemSchema).catch([]);

export const AddMachineryRequestSchema = z.object({
	type_id: z.number(),
	year: z.number(),
	plate: z.string(),
	serial: z.string(),
	start_date: z.string(),
	ownership: z.string(),
	status: z.union([z.string(), z.number()]),
	description: z.string(),
});

export type AddMachineryRequestType = z.infer<typeof AddMachineryRequestSchema>;

export const UpdateMachineryRequestSchema = AddMachineryRequestSchema;
export type UpdateMachineryRequestType = z.infer<typeof UpdateMachineryRequestSchema>;
