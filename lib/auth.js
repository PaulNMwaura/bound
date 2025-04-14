// /auth.ts or /lib/auth.ts
import NextAuth from "next-auth";
import authConfig from "./auth.config"; // make sure this path is correct

export const { auth } = NextAuth(authConfig);
