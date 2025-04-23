"use client";

import { useEffect, useRef, useState } from "react";
import DefaultAvatar from "@/assets/logo-holder.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { redirect } from "next/navigation";
import { IoMenu } from "react-icons/io5";
import { Sidenav } from "@/sections/messagesPage/Sidenav";

export const ViewAllMessages = ({ session, isLister, thisLister }) => {
  const [conversations, setConversations] = useState([]);
  const [isSidenavOpen, setOpenSidenav] = useState(false);
  const sidenavRef = useRef();

  const router = useRouter();

  // 🔄 Close sidenav when clicking outside of it
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        isSidenavOpen &&
        sidenavRef.current &&
        !sidenavRef.current.contains(event.target)
      ) {
        setOpenSidenav(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isSidenavOpen]);

  useEffect(() => {
    const fetchConversations = async () => {
      if (!session?.user?.id) return;
      try {
        const res = await fetch(
          `/api/chat/conversations?id=${session.user.id}`
        );
        const data = await res.json();
        setConversations(data.conversations || []);
      } catch (err) {
        console.error("Failed to fetch conversations:", err);
      }
    };

    fetchConversations();
  }, [session]);

  return (
    <div className="w-full">
      <header className="flex flex-row justify-between items-center md:flex-none border-b-2 border-gray-600/15 px-4 md:px-0">
        <button
          className="block md:hidden text-start text-[#555555]"
          onClick={() => router.back()}
        >
          Back
        </button>
        <div className="text-center md:w-full py-6 font-semibold tracking-tight">
          All Conversations
        </div>
        <button
          className="block md:hidden text-start text-[#555555]"
          onClick={() => setOpenSidenav(true)}
        >
          <IoMenu size={24} />
        </button>
      </header>
      <div className="mt-5 px-2 py-2">
        {conversations.map((c, index) => (
          <div
            key={index}
            className="flex items-center gap-4 px-3 py-4 mt-5 rounded shadow hover:bg-[#303030]/40 hover:border-l-4 hover:border-blue-500"
            onClick={() => redirect(`/messages?id=${c.conversationPartnerId}`)}
          >
            <Image
              src={c.partnerProfilePicture || DefaultAvatar}
              alt="Profile picture"
              width={48}
              height={48}
              className="rounded-full object-cover"
            />
            <div className="w-full flex justify-between">
              <div>
                <div className="font-semibold">{`${c.partnerUsername}`}</div>
                <div className="text-sm text-gray-600 truncate max-w-xs">
                  {c.content}
                </div>
              </div>
              <div className="text-end text-sm opacity-50">
                {(() => {
                  const currentDate = new Date();
                  const messageDate = new Date(c.date);

                  // Get the difference in days between the current date and the message date
                  const diffInTime = currentDate - messageDate;
                  const diffInDays = diffInTime / (1000 * 3600 * 24);

                  // Check if the message is from today, yesterday, or older
                  if (diffInDays < 1) {
                    // If less than 1 day old, show time
                    return messageDate.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    });
                  } else if (diffInDays < 2) {
                    // If less than 2 days old, show "Yesterday"
                    return "Yesterday";
                  } else {
                    // If more than 2 days old, show the date in "YYYY/MM/DD" format
                    return messageDate.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    });
                  }
                })()}
              </div>
            </div>
          </div>
        ))}
      </div>
      {isSidenavOpen && (
        <>
          {/* Backdrop to visually dim background */}
          <div className="fixed inset-0 bg-black/30 bg-opacity-40 z-40" />

          {/* Sidenav container */}
          <div
            ref={sidenavRef}
            className={`fixed top-0 left-0 w-[50%] h-full bg-white z-50 transition-transform duration-300 rounded-r-lg`}
          >
            <Sidenav session={session} isLister={isLister} thisLister={thisLister}/>
          </div>
        </>
      )}
    </div>
  );
};
