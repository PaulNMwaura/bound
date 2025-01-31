import LoginForm from "../sections/loginPage/LoginForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function Login() {
    // if the user is already signed in, they shouldn't be accessing the login page
    //__________________________________________________
    const session = await getServerSession(authOptions);
    
    if (session) redirect("/browse");
    return <LoginForm />
}