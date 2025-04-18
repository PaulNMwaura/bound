"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn, getSession } from "next-auth/react";

function validateCredentials (email, password, setError) {
    let status = 0
    if (email == "" || password == "") {
        if (email == "" ) {
            setError("Please provide an email");
            status = 1;
        }
        if (password == "") {
            setError("Please provide a password")
            status = 1;
        }
        if (email == "" && password =="") {
            setError("Please provide an email and password.");
            status = 1;
        }
    } 
    return status;
}

export default function LoginForm(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("submitted login form.");
        try {
            console.log("attempting to login user.");
            const res = await signIn("credentials", {
                email, password, redirect:false,
            });
            
            if(!res || res.error) {
                setError("Invalid Credentials.");
                return;
            }
            
            if (res.ok && !res.error)
                router.replace("/browse");
        } catch (error) {
            console.log("Error: ", error);
        }
    }

    return (
        <div className="w-screen h-screen flex flex-col justify-center items-center bg-white text-black dark:bg-black dark:text-white">
            <div className="rounded-lg p-6 w-full max-w-md">
                <h1 className="text-2xl font-bold mb-4">Login</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Email</label>
                        <input
                        type="email"
                        className="w-full border rounded px-3 py-2 mt-1"
                        onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Password</label>
                        <input
                        type="password"
                        className="w-full border rounded px-3 py-2 mt-1"
                        onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn-primary-alt px-4 py-2 rounded w-full cursor-pointer">
                        Login
                    </button>
                    <div>
                    {error && (
                        <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
                        {error}
                        </div>
                    )}
                    </div>
                    <div className="flex justify-center items-center">
                        <Link href={"/register"} className="text-sm lg:text-lg mt-3 font-bold">
                            Don't have an account?{" "}
                            <span className="underline">Sign Up</span>
                        </Link>
                    </div>
                </form>
                <button 
                onClick={() => router.replace("/")} 
                className="mt-4 dark:text-gray-300 dark:hover:text-gray-50 cursor-pointer">
                Cancel
                </button>
            </div>
        </div>
    );
};