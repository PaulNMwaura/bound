"use client";

import { useState, useEffect } from "react";
import Logo from "@/assets/logo-holder.png";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { IoMdMail, IoMdStar } from "react-icons/io";
import { BiSolidCommentEdit } from "react-icons/bi";
import { RiAlertFill } from "react-icons/ri";

export const Hero = ({ id, thisLister}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session } = useSession(); // Get logged-in user session

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!thisLister) {
    return <div>No lister found</div>;
  }

  const profileImage = thisLister.imageBase64
  ? thisLister.imageBase64
  : Logo;

  const isLister = session?.user?.id === thisLister.userId;

    return (
      <section className="py-10">
        <div className="container text-black lg:max-w-[80%]">
          <div className="text-sm md:text-lg">
            <div className="flex flex-col md:flex-row items-center md:gap-10">

              {/* Lister's profile picture and rating */}
              <div className="flex flex-col items-center gap-2">
                <Image src={Logo} alt="Profile picture goes here" height={100} width={100} className="rounded-full" unoptimized={!!thisLister.imageBase64}/>
                <div className="flex flex-row items-center">
                  <IoMdStar size={22}/>
                  {thisLister.rating ? (
                    <p className="font-medium">{thisLister.rating}/5</p>
                  ):(
                    <p className="font-medium">{"0"}/5</p>
                  )}
                </div>
              </div>

              {/* Lister's information (Name, Description, Location) */}
              <div className="w-full">
                <div className="flex justify-between font-semibold border border-[#B5B5B5] rounded-lg px-3 mb-2">
                  <div className="flex flex-row space-x-1">
                    <a className="font-semibold">{thisLister.firstname} {thisLister.lastname} |</a>
                    <a className="font-light">English</a>
                  </div>
                  <a>{thisLister.city}, {thisLister.state}</a>
                </div>
                <div>
                  {thisLister.description}
                </div>

                {/* Message and reviews buttons*/}
                <div className="mt-4 w-full flex justify-between text-xs md:text-lg">
                  <div className="flex -space-x-2 items-center">
                    <IoMdMail size={22}/>
                    <button className="btn hover:cursor-pointer">Message {thisLister.firstname}</button>
                  </div>
                  <div className="flex -space-x-2 items-center">
                    <BiSolidCommentEdit size={22}/>
                    <button className="btn hover:cursor-pointer">Reviews</button>
                  </div>
                  {!isLister && (
                    // I WANT THIS TO CREATE A POP UP WHERE THE USER CAN SELECT A REASON.
                    // REPORT REQUEST IS SENT AND STORED IN A DATABASE TABLE.
                    <div className="flex -space-x-2 items-center">
                      <RiAlertFill size={22} />
                      <button className="btn">Report</button>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>
    );
};