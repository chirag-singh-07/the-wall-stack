import { betterAuth } from "better-auth";
import { db } from "./prisma";
import { admin } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    sendVerificationEmail: false, // Completely disable email sending
  },
  emailVerification: {
    sendOnSignUp: false, // Don't send verification emails on signup
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [admin()],
  advanced: {
    generateId: false, // Use database auto-generated IDs
  },
  trustedOrigins: ["http://localhost:3000"],
});
