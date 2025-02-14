import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export const Information = () => {
    const { data: session } = useSession();
    
    if(!session) redirect("/");

    return (
        <div className="container text-center py-4">
            <div className="section-description">
                Whatever your hair needs, we got you {session?.user?.firstname}!
            </div>
        </div>
    );
};