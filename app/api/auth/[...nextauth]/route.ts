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
              return { id: user._id, firstname: user.firstname, lastname: user.lastname, email: user.email };
            } catch (error) {
              console.log("Error: ", error);
              return null; // Return null if an error occurs
            }
          },
        }),
    ],
    callbacks: {
        async session({ session, token }) {
          if (token?.id && session.user) {
            session.user.id = token.id; // Add user ID to session
          }
          if (token?.firstname) {
            session.user.firstname = token.firstname; // Add user firstname to session
          }
          if (token?.lastname) {
            session.user.lastname = token.lastname; // Add user lastname to session
          }
          return session;
        },
        async jwt({ token, user }) {
          if (user) {
            token.firstname = user.firstname;
            token.lastname = user.lastname;
            token.id = user.id; // Store user ID in token
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

export { handler as GET, handler as POST }
