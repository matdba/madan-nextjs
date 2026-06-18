import { z } from "zod";
import { CitySchema } from "./city-list.schema";
import { TruckSchema } from "./truck-list.schema";

export const DriverUserSchema = z.object({
  id: z.number().catch(0),
  name: z.string().catch(""),
  last_name: z.string().catch(""),
  mobile_number: z.string().catch(""),
  avatar: z.string().nullable().catch(null),
  role: z.string().nullable().catch(null),
});

export const DriverItemSchema = z.object({
  id: z.number().catch(0),
  register_status: z.boolean().catch(false),
  is_profile_complete: z.boolean().catch(false),
  birth_date: z.string().nullable().catch(null),
  total_cargos_count: z.number().catch(0),
  created_at: z.string().catch(""),
  updated_at: z.string().catch(""),
  license_plate: z.string().catch(""),
  license_plate_part_a: z.string().catch(""),
  license_plate_part_b: z.string().catch(""),
  license_plate_part_c: z.string().catch(""),
  license_plate_part_d: z.string().catch(""),
  user: DriverUserSchema.catch({
    id: 0,
    name: "",
    last_name: "",
    mobile_number: "",
    avatar: null,
    role: null,
  }),
  truck: TruckSchema.catch({
    id: 0,
    name: "",
    image: "",
    parent_id: 0,
    capacity: "",
  }),
  city: CitySchema.catch({
    id: 0,
    name: "",
    province_id: 0,
  }),
});

export const DriverPaginationSchema = z.object({
  current_count: z.number().catch(0),
  last_page_number: z.number().catch(0),
  current_page_number: z.number().catch(0),
  total: z.number().catch(0),
});

export const DriverListSchema = z.object({
  result: z.boolean().catch(false),
  message: z.string().catch(""),
  data: z.object({
    drivers: z.array(DriverItemSchema).catch([]),
    pagination: DriverPaginationSchema.catch({
      current_count: 0,
      last_page_number: 0,
      current_page_number: 0,
      total: 0,
    }),
  }),
});

export type DriverListResponse = z.infer<typeof DriverListSchema>;

export const AddDriverRequestSchema = z.object({
  name: z.string(),
  last_name: z.string(),
  mobile_number: z.string(),
  truck_id: z.number(),
  city_id: z.number(),
  license_plate_part_a: z.string(),
  license_plate_part_b: z.string(),
  license_plate_part_c: z.string(),
  license_plate_part_d: z.string(),
  national_code: z.string(),
})

export type AddDriverRequestType = z.infer<typeof AddDriverRequestSchema>;
