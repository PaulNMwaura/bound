'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Ably from 'ably';
import { redirect } from 'next/navigation';
import Image from 'next/image';

const PAGE_SIZE = 20;

function formatTimestamp(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const now = new Date();

  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) {
    return `${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  } else if (isYesterday) {
    return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  } else {
    return date.toLocaleDateString([], {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  }
}


export default function ChatBox({ otherUser, session }) {
  const currentUserId = session?.user?.id;
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [skip, setSkip] = useState(0);
  const isFetchingRef = useRef(false);
  const messagesEndRef = useRef(null);
  const topRef = useRef(null);
  const containerRef = useRef(null);
  const ablyRef = useRef(null);
  const channelRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
    } finally {
      // Rate limit duration
      setTimeout(() => {
        setIsSubmitting(false);
      }, 1000); // 3 second rate limit
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async (initial = false) => {
    if (!currentUserId || isFetchingRef.current || (!initial && !hasMore)) return;
    isFetchingRef.current = true;

    const res = await fetch(
      `/api/chat/history?otherUserId=${otherUser._id}&limit=${PAGE_SIZE}&skip=${initial ? 0 : skip}`
    );
    const data = await res.json();

    if (data.messages.length < PAGE_SIZE) setHasMore(false);

    setMessages((prev) => initial ? data.messages.reverse() : [...data.messages.reverse(), ...prev]);
    setSkip((prev) => prev + data.messages.length);

    isFetchingRef.current = false;
  };

  // Initial fetch
  useEffect(() => {
    setMessages([]);
    setSkip(0);
    setHasMore(true);
    fetchMessages(true).then(() => setLoading(false));
  }, [currentUserId, otherUser._id]);

  // Set up Ably
  useEffect(() => {
    if (!currentUserId) return;

    const ably = new Ably.Realtime({ authUrl: '/api/ably/auth', clientId: currentUserId });
    const channelName = [currentUserId, otherUser._id].sort().join('-');
    const channel = ably.channels.get(channelName);

    channel.subscribe('message', (msg) => {
      setMessages((prev) => [...prev, msg.data]);
    });

    ablyRef.current = ably;
    channelRef.current = channel;

    return () => {
      channel.unsubscribe();
      ably.close();
    };
  }, [currentUserId, otherUser._id]);

  const sendMessage = useCallback(async () => {
    if (!content.trim()) return;
    await fetch('/api/chat/send', {
      method: 'POST',
      body: JSON.stringify({ 
        senderId: currentUserId, 
        senderUsername: session.user.username, 
        senderProfilePicture: session.user.profilePicture,
        receiverId: otherUser._id, 
        receiverUsername: otherUser.username,
        receiverProfilePicture: otherUser.profilePicture,
        content }),
      headers: { 'Content-Type': 'application/json' },
    });
    setContent('');
  }, [content, currentUserId, otherUser._id]);

  useEffect(scrollToBottom, [messages]);

  // Lazy load on scroll
  const handleScroll = () => {
    if (!containerRef.current) return;
    if (containerRef.current.scrollTop < 50 && hasMore) {
      const currentScroll = containerRef.current.scrollHeight;
      fetchMessages().then(() => {
        requestAnimationFrame(() => {
          const newScroll = containerRef.current.scrollHeight;
          containerRef.current.scrollTop = newScroll - currentScroll;
        });
      });
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="w-full h-full mx-auto flex flex-col bg-gray-600/5">
      <div className="w-full p-3 flex justify-between items-center border-b-2 border-gray-600/15 bg-white dark:bg-black">
        <button className="px-4" onClick={() => redirect("/messages")}>
          Back
        </button>
        <div className="flex flex-row items-center gap-2">
          <div className="flex flex-col items-end">
            <div className="text-sm font-semibold">@{otherUser.username}</div>
          </div>
          <div>
            <Image
              src={otherUser.profilePicture}
              alt="Profile picture"
              width={48}
              height={48}
              className="rounded-full object-cover"
            />
          </div>
        </div>
      </div>
      <div
        className="flex-1 overflow-y-auto space-y-2 flex flex-col-reverse px-4"
        onScroll={handleScroll}
        ref={containerRef}
      >
        {[...messages].reverse().map((m) => (
          <div key={m._id || Math.random()} className={`${m.senderId === currentUserId ?  "self-end ml-auto" : "self-start mr-auto"}`}>
            <div className="text-xs font-semibold mb-1 opacity-70">
              {m.senderUsername}
            </div>

            <div
              className={`mb-4 w-fit max-w-xs ${
                m.senderId === currentUserId
                  ? "self-end ml-auto text-white bg-blue-500"
                  : "self-start mr-auto text-black bg-gray-200"
              } p-3 rounded-2xl`}
            >
              <div>{m.content}</div>
              <div className="text-[10px] mt-1 text-right opacity-60">
                {formatTimestamp(m.timestamp)}
              </div>
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      <div className="pb-24 md:pb-6 flex gap-2 p-2">
        <input
          className="flex-1 border rounded-4xl px-3 py-2 placeholder-black dark:placeholder-white"
          placeholder="Send message..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          disabled={isSubmitting}
          className={`${
            isSubmitting ? "bg-gray-400" : "bg-blue-500"
          } text-white px-4 py-2 rounded-4xl`}
        >
          {isSubmitting ? "sending..." : "send"}
        </button>
      </div>
    </div>
  );
}
