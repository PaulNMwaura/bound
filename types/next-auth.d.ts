// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      firstname: string;
      lastname: string;
      profilePicture: string;
    };
  }

  interface User {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
    profilePicture: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
    profilePicture: string;
  }
}
