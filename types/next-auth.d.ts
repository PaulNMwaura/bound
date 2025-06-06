// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      email: string;
      firstname: string;
      lastname: string;
      profilePicture: string;
      hasAccess: boolean;
    };
  }

  interface User {
    id: string;
    username: string;
    email: string;
    firstname: string;
    lastname: string;
    profilePicture: string;
    hasAccess: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    email: string;
    firstname: string;
    lastname: string;
    profilePicture: string;
    hasAccess: boolean;
  }
}
