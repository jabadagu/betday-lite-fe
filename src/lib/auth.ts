import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { ENV } from "@/config/env";

export const demoUsers = [
  {
    id: "u-1",
    name: "Ana Tipster",
    email: "ana@betday.dev",
    password: "betday123",
  },
  {
    id: "u-2",
    name: "Carlos Odds",
    email: "carlos@betday.dev",
    password: "betday123",
  },
] as const;

export const authOptions: NextAuthOptions = {
  secret: ENV.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const foundUser = demoUsers.find(
          (user) =>
            user.email === credentials.email && user.password === credentials.password,
        );

        if (!foundUser) {
          return null;
        }

        return {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.userId ?? "");
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
