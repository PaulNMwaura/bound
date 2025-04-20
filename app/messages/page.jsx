'use client';

import { useSearchParams } from 'next/navigation';
import { ViewAllMessages } from '@/sections/messagesPage/ViewAllMessages';
import { OpenMessage } from '@/sections/messagesPage/OpenMessage';
import { Suspense } from 'react';
import { Sidenav } from '@/sections/messagesPage/Sidenav';
import { useSession } from 'next-auth/react';


function MessagesInner() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const {data: session} = useSession();

  if(!session) return <div>Loading...</div>

  return (
    <div className='md:flex'>
      <div className='hidden md:block h-screen md:min-w-44 lg:min-w-60 border-r-2 border-gray-600/15'>
        <Sidenav session={session} />
      </div>
      <div className="w-full">
        <div className="md:flex md:flex-row justify-between">
          <div className={`w-full ${id ? 'hidden md:block' : 'block'}`}>
            <ViewAllMessages session={session}/>
          </div>
          <div className="w-full h-screen flex justify-center items-center border-l-2 border-gray-600/15">
            {id ? (
              <div className="w-full h-full fixed inset-0 md:static">
                <OpenMessage receiverId={id} session={session} />
              </div>
            ) : (
                <h1 className="hidden md:block">Click on a message to chat</h1>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Messages() {
  return (
    <Suspense fallback={<div>Loading messages...</div>}>
      <MessagesInner />
    </Suspense>
  );
}