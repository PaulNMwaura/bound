import { IoMenu } from "react-icons/io5";
import profilePicture from "@/app/assets/logo-holder.png";
import Image from "next/image";
import { signOut } from "next-auth/react";

export const Header = ({session}) => {
    return (
        <section>
            <div className="py-4 px-10 text-xs md:text-xl md:px-28 flex justify-between items-center">
                <div className="font-semibold">
                    Hello {session?.user?.firstname}!
                </div>
                <div className="flex flex-row items-center">
                    <div>
                        <button onClick={() => signOut()} className="btn">Sign out</button>
                    </div>
                    <div className="hidden md:block">
                        <Image src={profilePicture} alt="Profile Picture" width={30} height={30} />
                    </div>
                    <div className="block md:hidden">
                        <IoMenu />
                    </div>
                </div>
            </div>
        </section>
    );
};
