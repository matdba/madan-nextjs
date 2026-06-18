import { z } from "zod";

const OperatorUserSchema = z.object({
  user_id: z.number(),
  name: z.string().nullable().optional(),
  last_name: z.string().nullable().optional(),
  mobile_number: z.string().nullable().optional(),
  today_activity: z.string().nullable().optional(),
  previous_activity: z.string().nullable().optional(),
  joined_date: z.string().nullable().optional(),
  avatar: z.string().nullable().optional(),
});

const OperatorInfoSchema = z.object({
  title: z.string().nullable().optional(),
  operator_id: z.number(),
  status: z.string().nullable().optional(),
  last_cargo: z.array(z.unknown()).optional(),
  total_cargos_count: z.number().optional(),
  today_cargos_count: z.number().optional(),
});

export const OperatorListItemSchema = z.object({
  user: OperatorUserSchema,
  operator: OperatorInfoSchema,
});

export const OperatorsListSchema = z.object({
  result: z.boolean(),
  message: z.string(),
  data: z.object({
    operators: z.array(OperatorListItemSchema),
    pagination: z.object({
      current_count: z.number(),
      last_page_number: z.number(),
      current_page_number: z.number(),
    }),
  }),
});

export const OperatorDetailsSchema = z.object({
  result: z.boolean(),
  message: z.string(),
  data: z.object({
    user: OperatorUserSchema,
    operator: OperatorInfoSchema,
  }),
});

export const AddOperatorRequestSchema = z.object({
  mobile_number: z.string(),
  name: z.string(),
  last_name: z.string(),
  // title: z.string().nullable().optional().default(''),
  // avatar: z.string().nullable().optional().default(''),
});

export type OperatorsListType = z.infer<typeof OperatorsListSchema>;
export type OperatorDetailsType = z.infer<typeof OperatorDetailsSchema>;
export type AddOperatorRequestType = z.infer<typeof AddOperatorRequestSchema>;
