import LoginForm from "@/sections/loginPage/LoginForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";


export default async function Login() {
    // if the user is already signed in, they shouldn't be accessing the login page
    const session = await getServerSession();
    if (session) redirect("/browse");
    //__________________________________________________
    return <LoginForm />
}