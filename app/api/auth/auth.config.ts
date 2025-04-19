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
    
            if (!email || !password) return null;
    
            try {
              await connectMongoDB();
              const user = await User.findOne({ email });
    
              // If the user does not exist in the database...
              if (!user) return null;
    
              const passwordsMatch = await bcrypt.compare(password, user.password);
    
              // If the password hash does not match...
              if (!passwordsMatch) return null;
    
              // Return the user object (can include additional fields as needed)
              return { id: user._id, username: user.username, firstname: user.firstname, lastname: user.lastname, email: user.email, profilePicture: user.profilePicture };
            } catch (error) {
              console.log("Error: ", error);
              return null; // Return null if an error occurs
            }
          },
        }),
    ],
    callbacks: {
        async signIn({ user }) {
          const dbUser = await User.findOne({ email: user.email });
          if (!dbUser.verified) {
            throw new Error("Please verify your email address before logging in.");
          }
          return true;
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
          return session;
        },
        async jwt({ token, user }) {
          if (user) {
            token.id = user.id as string;
            token.username = user.username as string;
            token.firstname = user.firstname as string;
            token.lastname = user.lastname as string;
            token.email = user.email as string;
            token.profilePicture = user.profilePicture as string;
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
