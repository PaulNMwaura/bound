import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";

const authOptions: AuthOptions = {
    providers: [
      CredentialsProvider({
          name: "credentials",
          credentials: {
            email: { label: "Email", type: "text" },
            password: { label: "Password", type: "password" }
          },
    
        async authorize(credentials) {
          const email = credentials?.email;
          const password = credentials?.password;
        
          if (!email || !password) {
            console.log("Missing email or password");
            return null;
          }
        
          try {
            console.log("Connecting to MongoDB...");
            await connectMongoDB();
            console.log("Database connected");
        
            const user = await User.findOne({ email });
            if (!user) {
              console.log("User not found");
              return null;
            }
        
            const passwordsMatch = await bcrypt.compare(password, user.password);
            if (!passwordsMatch) {
              console.log("Invalid password");
              return null;
            }
        
            console.log("User authenticated successfully");
            return { id: user._id, username: user.username, firstname: user.firstname, lastname: user.lastname, email: user.email, profilePicture: user.profilePicture, hasAccess: user.hasAccess};
          } catch (error) {
            console.log("Error during authentication:", error);
            return null;
          }
        }        
      }),
    ],
    callbacks: {
        async signIn({ user }) {
          try {
            const dbUser = await User.findOne({ email: user.email });
            if (!dbUser || !dbUser.verified) {
              throw new Error("Please verify your email address before logging in.");
            }
            return true;  // Allow sign-in if everything is valid
          } catch (error) {
            console.log("Error during sign-in check:", error);
            return false;  // Return false if there's an error or the user is not verified
          }
        },
        async session({ session, token }) {
          if (token?.id && session.user) {
            session.user.id = token.id as string; // Add user ID to session
          }
          if (token?.username) {
            session.user.username = token.username as string; // Add user username to session
          }
          if (token?.firstname) {
            session.user.firstname = token.firstname as string; // Add user firstname to session
          }
          if (token?.lastname) {
            session.user.lastname = token.lastname as string; // Add user lastname to session
          }
          if (token?.email) {
            session.user.email = token.email as string; // Add user email to session
          }
          if (token?.profilePicture) {
            session.user.profilePicture = token.profilePicture as string; // Add user profilePicture to session
          }
          if(token?.hasAccess) {
            session.user.hasAccess = token.hasAccess as boolean;
          }
          return session;
        },
        async jwt({ token, user, trigger, session }) {
          if(trigger === "update"){
            return {...token, ...session.user};
          }
          if (user) {
            token.id = user.id as string;
            token.username = user.username as string;
            token.firstname = user.firstname as string;
            token.lastname = user.lastname as string;
            token.email = user.email as string;
            token.profilePicture = user.profilePicture as string;
            token.hasAccess = user.hasAccess as boolean;
          }
          return token;
        },
    },
    session: {
      strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
      signIn: "/login", // login page
    },
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, authOptions };