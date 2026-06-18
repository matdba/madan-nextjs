import { z } from "zod"

export const TruckSchema = z.object({
  id: z.number().catch(0),
  image: z.string().catch(""),
  name: z.string().catch(""),
  parent_id: z.number().catch(0),
  capacity: z.string().catch(""),
});

export const TrucksSchema = z.object({
  result: z.boolean(),
  message: z.string(),
  data: z.array(TruckSchema)
})

export type TruckListType = z.infer<typeof TrucksSchema>;

