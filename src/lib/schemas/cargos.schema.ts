import { CostType } from "@/utils/cost-types";
import { z } from "zod";
import { CitySchema } from "./city-list.schema";
import { TruckSchema } from "./truck-list.schema";


export const CargoItemSchema = z.object({
  id: z.number().catch(0),
  title: z.string().catch(""),
  user_id: z.number().catch(0),
  weight: z.number().catch(0),
  cost: z.number().catch(0),
  cost_per: z.string().catch(""),
  free_weight: z.boolean().catch(false),
  image: z.string().catch(""),
  description: z.string().catch(""),
  like: z.number().catch(0),
  dislike: z.number().catch(0),
  status: z.string().catch(""),
  created_at: z.string().catch(""),
  updated_at: z.string().catch(""),
  truck: TruckSchema.catch({
    id: 0,
    name: "",
    image: "",
    parent_id: 0,
    capacity: "",
  }),
  loading_city: CitySchema.catch({
    id: 0,
    name: "",
    province_id: 0,
  }),
  discharging_city: CitySchema.catch({
    id: 0,
    name: "",
    province_id: 0,
  }),
});

export const CargoPaginationSchema = z.object({
  current_count: z.number().catch(0),
  last_page_number: z.number().catch(0),
  current_page_number: z.number().catch(0),
  total_items: z.number().catch(0),
});

export const CargosSchema = z.object({
  result: z.boolean().catch(false),
  message: z.string().catch(""),
  data: z.object({
    cargos: z.array(CargoItemSchema).catch([]),
    pagination: CargoPaginationSchema.catch({
      current_count: 0,
      last_page_number: 0,
      current_page_number: 0,
      total_items: 0,
    }),
  }),
});

export type CargosType = z.infer<typeof CargosSchema>;

export const AddCargoRequestSchema = z.object({
  title: z.string(),
  mobile_number: z.string(),
  loading_city_id: z.number(),
  discharging_city_id: z.number(),
  truck_id: z.number(),
  weight: z.number(),
  cost: z.number(),
  cost_per: z.enum(CostType),
  description: z.string(),
  free_weight: z.boolean(),
  is_private: z.boolean(),
});

export type AddCargoRequestType = z.infer<typeof AddCargoRequestSchema>;
