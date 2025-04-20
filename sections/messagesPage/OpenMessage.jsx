'use client';

import { useEffect, useState } from 'react';
import ChatBox from '@/components/ChatBox';

export const OpenMessage = ({ receiverId, session }) => {
  const [receiver, setReceiver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchReceiver = async () => {
      try {
        const res = await fetch(`/api/users/${receiverId}`);
        if (!res.ok) throw new Error('User not found');
        const data = await res.json();
        setReceiver(data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchReceiver();
  }, [receiverId]);

  if (loading) return <div>Loading...</div>;
  if (error || !receiver) return <div>User not found.</div>;

  return (
    <div className="w-full h-screen">
      <ChatBox otherUser={receiver} session={session} />
    </div>
  );
};
