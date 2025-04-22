import { signOut } from "next-auth/react";
import Link from "next/link";

export const Header = ({session}) => {
    return (
        <header>
            <div className="container p-2 flex items-center justify-between">
                <div>
                    Logo
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