'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import DefaultAvatar from "@/assets/logo-holder.png";
import Image from "next/image";
import { useRouter } from 'next/navigation';

export const ViewAllMessages = () => {
  const { data: session } = useSession();
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
    <div className="w-full h-screen space-y-4 p-2">
        <header className='text-center pt-2 '>
            Messages
        </header>
        <div className='md:px-16 py-2 h-[85%]'>
          {conversations.map((c,index) => (
              <div
              key={index}
              className="flex items-center gap-4 px-3 py-2 rounded shadow hover:bg-[#303030]/40"
              onClick={() => router.push(`/messages?id=${c.senderId}`)}
              >
                <Image
                    src={c.otherUserImage || DefaultAvatar}
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                    <div className="font-semibold">{`${c.senderName || "Sender Name"}`}</div>
                    <div className="text-sm text-gray-600 truncate max-w-xs">{c.content}</div>
                </div>
              </div>
          ))}
        </div>
    </div>
  );
};
