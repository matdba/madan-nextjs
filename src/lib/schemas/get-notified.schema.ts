import { z } from "zod";

const UserSchema = z.object({
  id: z.number(),
  name: z.string().nullable().optional(),
  last_name: z.string().nullable().optional(),
  mobile_number: z.string().nullable().optional(),
  present_code: z.number().nullable().optional(),
  presenter_code: z.number().nullable().optional(),
  wallet: z.number().nullable().optional(),
  refah_wallet: z.number().nullable().optional(),
  national_code: z.string().nullable().optional(),
  fcm_token: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  avatar: z.string().nullable().optional(),
  email_verified_at: z.string().nullable().optional(),
  last_seen: z.string().nullable().optional(),
  created_at: z.string().nullable().optional(),
  updated_at: z.string().nullable().optional(),
  is_driver: z.boolean().nullable().optional(),
  is_admin: z.boolean().nullable().optional(),
  today_activity: z.string().nullable().optional(),
  previous_activity: z.string().nullable().optional(),
  role: z.string().nullable().optional(),
});

const TruckSchema = z.object({
  id: z.number(),
  image: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
  parent_id: z.number().nullable().optional(),
  capacity: z.string().nullable().optional(),
  created_at: z.string().nullable().optional(),
  updated_at: z.string().nullable().optional(),
});

const CitySchema = z.object({
  id: z.number(),
  name: z.string().nullable().optional(),
  province_id: z.number().nullable().optional(),
  latitude: z.string().nullable().optional(),
  longitude: z.string().nullable().optional(),
  priority: z.number().nullable().optional(),
  created_at: z.string().nullable().optional(),
  updated_at: z.string().nullable().optional(),
});

export const LetMeKnowSchema = z.object({
  id: z.number(),
  mobile_number: z.string(),
  truck_id: z.number(),
  loading_city_id: z.number(),
  discharging_city_id: z.number(),
  weight_from: z.string(),
  weight_to: z.string(),
  cost_from: z.string(),
  cost_to: z.string(),
  transportation_company_id: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
  cargo_type_id: z.number().nullable().optional(),
  user: UserSchema.optional(),
  truck: TruckSchema.optional(),
  loading_city: CitySchema.optional(),
  discharging_city: CitySchema.optional(),
});

export const GetNotifiedListSchema = z.object({
  result: z.boolean(),
  message: z.string(),
  data: z.object({
    let_me_knows: z.array(LetMeKnowSchema),
  }),
});

export type GetNotifiedListType = z.infer<typeof GetNotifiedListSchema>;
export type LetMeKnowType = z.infer<typeof LetMeKnowSchema>;
