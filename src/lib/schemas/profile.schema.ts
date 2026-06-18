import { z } from "zod";

export const ProfileDataSchema = z.object({
  id: z.number().catch(0),
  user_id: z.number().catch(0),
  title: z.string().catch(""),
  hall_image: z.string().catch(""),
  private_hall: z.boolean().catch(false),
  register_number: z.string().catch(""),
  wallet: z.number().catch(0),
  created_at: z.string().catch(""),
  updated_at: z.string().catch(""),
});

export const ProfileSchema = z.object({
  result: z.boolean().catch(false),
  message: z.string().catch(""),
  data: z
    .object({
      profile: ProfileDataSchema,
    })
    .catch({
      profile: {
        id: 0,
        user_id: 0,
        title: "",
        hall_image: "",
        private_hall: false,
        register_number: "",
        wallet: 0,
        created_at: "",
        updated_at: "",
      },
    }),
});

export type ProfileType = z.infer<typeof ProfileSchema>;
