import LoginForm from "./components/LoginForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function Home() {
    // if the user is already signed in, they shouldn't be accessing the login page
    //__________________________________________________
    const session = await getServerSession(authOptions);
    
    if (session) redirect("/home");
    //__________________________________________________
  return (
    <main>
      <LoginForm />
    </main>
  );
}
