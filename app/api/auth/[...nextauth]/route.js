import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectMongoDB } from "@/app/lib/mongodb";
import User from "@/app/models/user";
import bcrypt from "bcryptjs";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {},

            async authorize(credentials) {
                const { email, password } = credentials;

                try {
                    await connectMongoDB();
                    const user = await User.findOne({ email });
                    // If the user does not exist in our database...
                    if (!user) return null;

                    const passwordsMatch = await bcrypt.compare(password, user.password);
                    // If the hash of the input password and stored password do not match...
                    if (!passwordsMatch) return null;

                    // Return the user object (you can include any fields you need)
                    return user;
                } catch (error) {
                    console.log("Error: ", error);
                    return null; // Return null if an error occurs
                }
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/", // Custom sign-in page
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
