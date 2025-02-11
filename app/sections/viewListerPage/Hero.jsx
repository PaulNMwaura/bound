"use client";

import { useState, useEffect } from "react";
import Logo from "@/app/assets/logo-holder.png";
import Image from "next/image";
import { useSession } from "next-auth/react";

export const Hero = ({ id }) => {
  const [thisLister, setLister] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session } = useSession(); // Get logged-in user session
  useEffect(() => {
    // Fetch lister data when component mounts
    const fetchLister = async () => {
      try {
        const response = await fetch(`/api/findListers/${id}`);
        if (!response.ok) {
          throw new Error('Lister not found');
        }
        const data = await response.json();
        // console.log("data: ", data.lister);
        setLister(data.lister);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLister();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!thisLister) {
    return <div>No lister found</div>;
  }

  const profileImage = thisLister.imageBase64
  ? thisLister.imageBase64
  : Logo;

    return (
      <section className="pb-10">
        <div className="container">
          <div className="pt-10 text-sm md:text-lg">
            <div className="flex flex-col md:flex-row items-center md:gap-10">
              <div>
                <Image src={thisLister.picture || Logo} alt="Profile picture goes here" height={100} width={100} className="rounded-full" unoptimized={!!thisLister.imageBase64}/>
              </div>
              <div className="w-full">
                <div className="flex justify-between font-semibold">
                  <a>{thisLister.rating}</a>
                  <a>{thisLister.city}, {thisLister.state}</a>
                </div>
                <div>
                  {thisLister.description}
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <a className="font-semibold">{thisLister.firstname} {thisLister.lastname}</a>
              <a className="font-light">English</a>
            </div>
          </div>
        </div>
      </section>
    );
};