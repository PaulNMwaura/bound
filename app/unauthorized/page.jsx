"use client";

import { redirect } from "next/navigation"
import { signOut } from "next-auth/react";

export default function unauthorized ({params}) {
    return (
        <div className="w-screen h-screen flex flex-col justify-center items-center gap-4">
            <p className="text-center">Oops! Something went wrong. <br /> Please go back to your previous page, or sign back in through the home page</p>
            <button type="button" onClick={() => signOut({ callbackUrl: "/home" })} className="btn btn-primary-alt">Home</button>
        </div>
    )
}