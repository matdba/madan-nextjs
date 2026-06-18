import { DefaultSession } from "next-auth";
import "next-auth/jwt";
import type { LoginUserData } from "@/lib/schemas/auth.schema";
import type { ProfileType } from "@/lib/schemas/profile.schema";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      userId?: string;
      phoneNumber?: string;
      permissions?: string[];
      userData?: LoginUserData | null;
      profile?: ProfileType["data"]["profile"] | null;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    accessToken?: string;
    userId?: string;
    phoneNumber?: string;
    permissions?: string[];
    userData?: LoginUserData | null;
    profile?: ProfileType["data"]["profile"] | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    userId?: string;
    phoneNumber?: string;
    permissions?: string[];
    userData?: LoginUserData | null;
    profile?: ProfileType["data"]["profile"] | null;
  }
}
