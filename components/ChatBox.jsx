'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Ably from 'ably'; // ✅ works with version 2.6.5
import { useSession } from 'next-auth/react';

export default function ChatBox({ otherUserId }) {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const messagesEndRef = useRef(null);
  const channelRef = useRef(null);
  const ablyRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch previous messages
  useEffect(() => {
    if (!currentUserId) return;

    const fetchMessages = async () => {
      const res = await fetch(`/api/chat/history?otherUserId=${otherUserId}`);
      const data = await res.json();
      setMessages(data.messages);
    };

    fetchMessages();
  }, [currentUserId, otherUserId]);

  // Set up Ably
  useEffect(() => {
    if (!currentUserId) return;

    const ably = new Ably.Realtime({
      authUrl: '/api/ably/auth',
      clientId: currentUserId,
    });

    ably.connection.on('connected', () => {
      console.log('✅ Ably connected as', currentUserId);
    });

    const channelName = [currentUserId, otherUserId].sort().join('-');
    const channel = ably.channels.get(channelName);

    // Subscribe to incoming messages
    channel.subscribe('message', (msg) => {
    //   console.log('📩 Received:', msg.data);s
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

    // Save to DB and publish to Ably
    await fetch('/api/chat/send', {
      method: 'POST',
      body: JSON.stringify({
        senderId: currentUserId,
        receiverId: otherUserId,
        content,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    setContent('');
  }, [content, currentUserId, otherUserId]);

  useEffect(scrollToBottom, [messages]);

  return (
    <div className="w-full max-w-[95%] mx-auto border rounded-lg shadow p-4 flex flex-col h-[90vh]">
      <div className="flex-1 overflow-y-auto mb-4 space-y-2">
        {messages.map((m) => (
          <div
            key={m._id || Math.random()}
            className={`p-2 rounded-md max-w-xs ${
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

      <div className="flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-2"
          placeholder="Type a message..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
