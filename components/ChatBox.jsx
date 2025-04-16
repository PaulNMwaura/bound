'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Ably from 'ably';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const PAGE_SIZE = 20;

export default function ChatBox({ otherUserId }) {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;
  const router = useRouter();

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async (initial = false) => {
    if (!currentUserId || isFetchingRef.current || (!initial && !hasMore)) return;
    isFetchingRef.current = true;

    const res = await fetch(
      `/api/chat/history?otherUserId=${otherUserId}&limit=${PAGE_SIZE}&skip=${initial ? 0 : skip}`
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
  }, [currentUserId, otherUserId]);

  // Set up Ably
  useEffect(() => {
    if (!currentUserId) return;

    const ably = new Ably.Realtime({ authUrl: '/api/ably/auth', clientId: currentUserId });
    const channelName = [currentUserId, otherUserId].sort().join('-');
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
  }, [currentUserId, otherUserId]);

  const sendMessage = useCallback(async () => {
    if (!content.trim()) return;
    await fetch('/api/chat/send', {
      method: 'POST',
      body: JSON.stringify({ senderId: currentUserId, receiverId: otherUserId, content }),
      headers: { 'Content-Type': 'application/json' },
    });
    setContent('');
  }, [content, currentUserId, otherUserId]);

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
    <div className="w-full max-w-[95%] mx-auto border rounded-lg shadow flex flex-col h-[90vh]">
        <button className="md:hidden p-4 self-start" onClick={() => router.push('/messages')}>
            Back
        </button>
        <div className="p-6 border-b">
            Picture, Name, Status?
        </div>
        <div
            className="flex-1 overflow-y-auto space-y-2 flex flex-col-reverse pr-4"
            onScroll={handleScroll}
            ref={containerRef}
        >
            {[...messages].reverse().map((m) => (
                <div
                    key={m._id || Math.random()}
                    className={`mb-4 p-2 rounded-md w-fit max-w-xs ${
                    m.senderId === currentUserId
                        ? 'bg-blue-500 text-white self-end ml-auto'
                        : 'bg-gray-200 text-black self-start mr-auto'
                    }`}
                >
                    {m.content}
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>

        <div className="flex gap-2 p-2">
            <input
            className="flex-1 border rounded px-3 py-2 placeholder-black dark:placeholder-white"
            placeholder="Type a message..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button onClick={sendMessage} className="bg-blue-600 text-white px-4 py-2 rounded">
            Send
            </button>
        </div>
    </div>
  );
}
