import { z } from "zod";

export const MachineTypeSchema = z.object({
  TypeID: z.number().catch(0),
  TypeName: z.string().catch(""),
});

export type MachineTypeItem = z.infer<typeof MachineTypeSchema>;

// The backend list returns a direct array of drivers. Field names beyond the
// documented ones are uncertain, so we accept several casings and passthrough.
export const DriverSchema = z
  .object({
    DriverID: z.number().catch(0),
    DriverName: z.string().optional(),
    name: z.string().optional(),
    national_code: z.string().optional(),
    NationalCode: z.string().optional(),
    phone: z.string().optional(),
    Phone: z.string().optional(),
    description: z.string().optional(),
    Description: z.string().optional(),
    machine_types: z.array(MachineTypeSchema).catch([]),
  })
  .passthrough();

export type DriverItem = z.infer<typeof DriverSchema>;

export const DriverListSchema = z.array(DriverSchema).catch([]);

export const AddDriverRequestSchema = z.object({
  national_code: z.string(),
  name: z.string(),
  phone: z.string(),
  description: z.string(),
  machine_type_ids: z.array(z.number()),
});

export type AddDriverRequestType = z.infer<typeof AddDriverRequestSchema>;

export const UpdateDriverRequestSchema = AddDriverRequestSchema;
export type UpdateDriverRequestType = z.infer<typeof UpdateDriverRequestSchema>;
