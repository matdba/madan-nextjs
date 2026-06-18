import NextAuth, { AuthOptions, User } from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
import { LoginCredentialsSchema, LoginResponseSchema } from "@/lib/schemas/auth.schema";

// class MyUser implements User {
//   token: string,
//   phoeNumber: string
// }

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      id: "credentials",
      credentials: {
        userId: { label: "User ID", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials) return null;

        try {
          const { userId, password } = LoginCredentialsSchema.parse(credentials);
          const backendUrl = (process.env.LOGIN_BACKEND_URL || "http://89.32.249.4").replace(/\/$/, "");

          const res = await fetch(
            `${backendUrl}/api/login`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                UserID: userId,
                UserPass: password,
              }),
            }
          );

          const raw = await res.json();

          if (!res.ok) {
            return null;
          }

          const result = LoginResponseSchema.parse(raw);

          if (result.status !== "success") {
            return null;
          }

          const userData = {
            UserID: result.UserID,
            permissions: result.permissions,
            status: result.status,
          };

          const user: User = {
            id: result.UserID,
            name: result.UserID,
            accessToken: result.UserToken,
            userId: result.UserID,
            permissions: result.permissions,
            userData,
          };

          return user;

        } catch (err) {
          console.error('NextAuth authorize error:', err);
          return null;
        }

      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.userId = user.userId;
        token.permissions = user.permissions ?? [];
        token.userData = user.userData ?? null;
        token.profile = user.profile ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.userId;
      session.user.userId = token.userId;
      session.user.permissions = token.permissions ?? [];
      session.user.userData = token.userData ?? null;
      session.user.phoneNumber = token.phoneNumber;
      session.user.profile = token.profile ?? null;
      // TEMP: expose access token to the client for debugging
      (session as unknown as { accessToken?: string }).accessToken = token.accessToken as string;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
