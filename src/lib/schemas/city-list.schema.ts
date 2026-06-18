import { z } from "zod"

export const CitySchema = z.object({
  id: z.number().catch(0),
  name: z.string().catch(""),
  province_id: z.number().catch(0),
});

export const CitiesSchema = z.object({
  result: z.boolean(),
  message: z.string(),
  data: z.array(CitySchema)
})

export type CityListType = z.infer<typeof CitiesSchema>;

