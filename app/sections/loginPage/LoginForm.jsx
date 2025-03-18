"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginForm(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await signIn("credentials", {
                email, password, redirect:false,
            });
            
            if(res.error) {
                setError("Invalid Credentials.");
                return;
            }

            router.replace("browse");
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    return (
        <div className="w-screen h-screen flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
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
                        className="bg-black text-white px-4 py-2 rounded w-full">
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
                className="mt-4 text-gray-500 hover:text-gray-700">
                Cancel
                </button>
            </div>
        </div>
    );
};

