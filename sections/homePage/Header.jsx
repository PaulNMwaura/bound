import { signOut } from "next-auth/react";
import Link from "next/link";
import LogoBlack from "@/assets/Logo-black.png";
import LogoWhite from "@/assets/Logo-white.png";
import Image from "next/image";

export const Header = ({session}) => {
    return (
        <header>
            <div className="container p-2 flex items-center justify-between">
                <div>
                    <Image src={LogoBlack.src} alt="Logo"  width={20} height={20} className="dark:hidden" />
                    <Image src={LogoWhite.src} alt="Logo" width={20} height={20} className="hidden dark:block" />
                </div>
                {!session ? (
                    <div className="flex gap-5 items-center">
                        <Link href={"/login"}>Login</Link>
                        <Link href={"/register"} className="btn btn-primary-alt">Sign Up</Link>
                    </div>
                ):(
                    <button className="btn" onClick={() => signOut()}>Sign Out</button>
                )}
            </div>
        </header>
    )
};