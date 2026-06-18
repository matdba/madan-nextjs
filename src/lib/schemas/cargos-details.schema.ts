import { z } from "zod"

export const CargoDetailsSchema = z.object({
  result: z.boolean().default(false).nullish(),
  message: z.string().default('').nullish(),
  data: z.object({
    id: z.number().default(0).nullish(),
    title: z.string().default('').nullish(),
    mobile_number: z.string().default('').nullish(),
    user_id: z.number().default(0).nullish(),
    transportation_company_id: z.number().default(0).nullish(),
    loading_city_id: z.number().default(0).nullish(),
    discharging_city_id: z.number().default(0).nullish(),
    loading_city_lat: z.number().default(0).nullish(),
    loading_city_long: z.number().default(0).nullish(),
    discharging_city_lat: z.number().default(0).nullish(),
    discharging_city_long: z.number().default(0).nullish(),
    truck_id: z.number().default(0).nullish(),
    cargo_type_id: z.number().default(0).nullish(),
    weight: z.string().default('').nullish(),
    cost: z.number().default(0).nullish(),
    cost_per: z.string().default('').nullish(),
    free_weight: z.union([z.boolean(), z.string()]).default(false).nullish(),
    image: z.string().default('').nullish(),
    description: z.string().default('').nullish(),
    store_for: z.string().default('').nullish(),
    user_type: z.string().default('').nullish(),
    like_: z.number().default(0).nullish(),
    dislike: z.number().default(0).nullish(),
    created_at: z.string().default('').nullish(),
    updated_at: z.string().default('').nullish(),
    status: z.string().default('').nullish(),
    transportation_company: z.object({
      id: z.number().default(0).nullish(),
      user_id: z.number().default(0).nullish(),
      title: z.string().default('').nullish(),
      hall_image: z.string().default('').nullish(),
      private_hall: z.boolean().default(false).nullish(),
      register_number: z.string().default('').nullish(),
      wallet: z.number().default(0).nullish(),
      created_at: z.string().default('').nullish(),
      updated_at: z.string().default('').nullish()
    }).nullish(),
    cargo_type: z.string().default('').nullish(),
    loading_city: z.object({
      id: z.number().default(0).nullish(),
      name: z.string().default('').nullish(),
      province_id: z.number().default(0).nullish(),
      latitude: z.string().default('').nullish(),
      longitude: z.string().default('').nullish(),
      priority: z.number().default(0).nullish(),
      created_at: z.string().default('').nullish(),
      updated_at: z.string().default('').nullish()
    }),
    discharging_city: z.object({
      id: z.number().default(0).nullish(),
      name: z.string().default('').nullish(),
      province_id: z.number().default(0).nullish(),
      latitude: z.string().default('').nullish(),
      longitude: z.string().default('').nullish(),
      priority: z.number().default(0).nullish(),
      created_at: z.string().default('').nullish(),
      updated_at: z.string().default('').nullish()
    }),
    truck: z.object({
      id: z.number().default(0).nullish(),
      image: z.string().default('').nullish(),
      name: z.string().default('').nullish(),
      parent_id: z.number().default(0).nullish(),
      capacity: z.string().default('').nullish(),
      created_at: z.string().default('').nullish(),
      updated_at: z.string().default('').nullish()
    })
  })
})

export type CargoDetailsType = z.infer<typeof CargoDetailsSchema>;
