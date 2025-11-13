import LoginForm from "@/sections/loginPage/LoginForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/auth.config";

export default async function Login() {
    // if the user is already signed in, they shouldn't be accessing the login page
    const session = await getServerSession(authOptions);
    if (session) redirect("/");
    //__________________________________________________
    return <LoginForm />
}