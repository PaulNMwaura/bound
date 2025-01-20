"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phone, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");


  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firstname || !lastname || !phone || !email || !password) {
      setError("All fields are necessary.");
      return;
    }

    try {
      const resUserExists = await fetch("api/userExists", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
      });

      const {user} = await resUserExists.json();

      if(user) {
          setError("User already exists.");
          return;
      }

      const res = await fetch("api/register", {
        // cache: "no-store",
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          firstname, lastname, phone, email, password,
        }),
      })

      if(res.ok) {
        const form = e.target;
        form.reset();
        router.push("/");
      } else {
        console.log("User registration failed.");
      }
    } catch (error) {
      console.log("Error during registration: ", error);
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Create Account</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium">First Name</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 mt-1"
              onChange={(e) => setFirstname(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Last Name</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 mt-1"
              onChange={(e) => setLastname(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Phone Number</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 mt-1"
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
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
            className="bg-black text-white px-4 py-2 rounded w-full"
          >
            Sign Up
          </button>
          <div>
            {error && (
              <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
                {error}
              </div>
            )}
          </div>
          <div className="flex justify-center items-center">
            <Link href={"/"} className="text-sm lg:text-lg mt-3 font-bold">
              Already have an account?{" "}
              <span className="underline">Login</span>
            </Link>
          </div>
        </form>
        <button className="mt-4 text-gray-500 hover:text-gray-700">
          Cancel
        </button>
      </div>
    </div>
  );
};