'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import DefaultAvatar from "@/assets/logo-holder.png";
import Image from "next/image";
import { useRouter } from 'next/navigation';

export const ViewAllMessages = ({session}) => {
  // const { data: session } = useSession();
  const [conversations, setConversations] = useState([]);

  const router = useRouter();

  useEffect(() => {
    const fetchConversations = async () => {
      if (!session?.user?.id) return;

      try {
        const res = await fetch(`/api/chat/conversations?id=${session.user.id}`);
        const data = await res.json();
        setConversations(data.conversations || []);
      } catch (err) {
        console.error('Failed to fetch conversations:', err);
      }
    };

    fetchConversations();
  }, [session]);

  return (
    <div className="w-full">
        <header className='flex flex-row items-center md:flex-none border-b-2 border-gray-600/15'>
          <button className='block md:hidden w-[25%] text-start pl-2' onClick={() => router.back()}>
            Back
          </button>
          <div className='text-center w-[50%] md:w-full py-6'>
              All Conversations
          </div>
        </header>
        <div className='mt-5 px-2 py-2'>
          {conversations.map((c,index) => (
              <div
              key={index}
              className="flex items-center gap-4 px-3 py-4 mt-5 rounded shadow hover:bg-[#303030]/40 hover:border-l-4 hover:border-blue-500"
              onClick={() => router.push(`/messages?id=${c.senderId}`)}
              >
                <Image
                    src={c.otherUserImage || DefaultAvatar}
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover"
                />
                <div className='w-full flex justify-between'>
                    <div> 
                      <div className="font-semibold">{`${c.senderName || "Sender Name"}`}</div>
                      <div className="text-sm text-gray-600 truncate max-w-xs">{c.content}</div>
                    </div>
                    <div className='text-end'>
                      TIME
                    </div>
                </div>
              </div>
          ))}
        </div>
    </div>
  );
};
