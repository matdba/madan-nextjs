import { z } from "zod";

export const DashboardResponseSchema = z.object({
  result: z.boolean(),
  message: z.string(),
  data: z.object({
    cargos_by_month: z.record(
      z.string(),   // month like "05", "10"
      z.number()
    ),

    // [number[], string[]]
    top_cargo_owners: z.tuple([
      z.array(z.number()),
      z.array(z.string()),
    ]),

    top_destinations: z.record(
      z.string(),   // destination name (dynamic, Persian)
      z.number()
    ),

    top_trucks: z.record(
      z.string(),   // truck type (dynamic, Persian)
      z.number()
    ),

    cargos_status_by_month: z.record(
      z.string(),   // month
      z.object({
        confirmed: z.number(),
        cancelled: z.number(),
      })
    ),
  }),
});
