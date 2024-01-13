import { type NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";

import GithubProvider from "next-auth/providers/github";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

import type { Adapter } from "next-auth/adapters";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { db } from "@/lib/db";

export const authConfigOptions = {
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "john@example.com",
          required: true,
        },
        password: {
          label: "Password",
          type: "password",
          required: true,
        },
      },
      async authorize(credentials) {
        try {
          const { email, password } = credentials!;

          const user = await db.user.findUnique({ where: { email } });

          if (!user) {
            return null;
          }

          const passwordsMatch = await bcrypt.compare(
            password,
            user.password || ""
          );

          if (!passwordsMatch) {
            return null;
          }

          return user;
        } catch (error) {
          console.error(error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    EmailProvider({
      server: process.env.EMAIL_SERVER!,
      from: process.env.EMAIL_FROM!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    // Set to jwt, when Credentials provided is used, then only user will be authenticated
    strategy: "jwt",
  },
  jwt: {
    maxAge: 60 * 60 * 24 * 1,
  },
  callbacks: {
    async jwt({ token }) {
      return token;
    },
    async session({ session }) {
      return session;
    },
  },
} satisfies NextAuthOptions;
