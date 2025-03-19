import RegisterForm from "../components/RegisterUserForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function Register () {
    // if the user is already signed in, they shouldn't be accessing the registration page
    //__________________________________________________
    const session = await getServerSession(authOptions);
    
    if (session) redirect("/home");
    //__________________________________________________

    return (
        <RegisterForm />
    );
};