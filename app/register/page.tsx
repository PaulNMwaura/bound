import RegisterForm from "@/sections/registerPage/RegisterForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function Register () {
    // if the user is already signed in, they shouldn't be accessing the registration page
    //__________________________________________________
    const session = await getServerSession();
    
    if (session) redirect("/browse");
    //__________________________________________________

    return (
        <RegisterForm />
    );
};