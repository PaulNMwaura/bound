'use client'

import { useSearchParams } from 'next/navigation';
import { ViewAllMessages } from '@/sections/messagesPage/ViewAllMessages';
import { OpenMessage } from '@/sections/messagesPage/OpenMessage';

export default function Messages() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  return (
    <div className="md:flex md:flex-row justify-between h-screen">
      {/* Always render ViewAllMessages to preserve state */}
      <div className={`w-full ${id ? 'hidden md:block' : 'block'}`}>
        <ViewAllMessages />
      </div>

      {/* Conditionally render OpenMessage */}
      {id ? (
        <div className="w-full fixed inset-0 md:static">
          <OpenMessage reciverId={id} />
        </div>
      ): (
        <div className="hidden md:flex  w-full justify-center items-center">
            <h1>Click on a message to chat</h1>
        </div>
      )}
    </div>
  );
}
