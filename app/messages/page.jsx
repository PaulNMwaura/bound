'use client';

import { redirect, useSearchParams } from 'next/navigation';
import { ViewAllMessages } from '@/sections/messagesPage/ViewAllMessages';
import { OpenMessage } from '@/sections/messagesPage/OpenMessage';
import { Suspense } from 'react';
import { Sidenav } from '@/sections/messagesPage/Sidenav';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

async function checkIfLister(id) {
  const res = await fetch(`/api/listers/findByUserId?id=${id}`);

  if (res.status === 404) {
    return false; // not a lister
  }
  
  const data = await res.json();
  return data.lister ? data.lister : false; // if lister is found, return the lister data
}

function MessagesInner() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const {data: session, status} = useSession();
  const [lister, setLister] = useState(null);
  const [isLister, setIsLister] = useState(false);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    // Only check if session is loaded
    if (session) {
      const checkListerStatus = async () => {
        console.log("ID: ", session.user.id);
        const res = await checkIfLister(session.user.id);
        setLister(res);
        if(res != false) setIsLister(true);
      };

      checkListerStatus();
      if(lister != false || lister)
        setLoading(false);
    }
  }, [session]);
  if(status == "loading") return <div className="heads-up">Loading...</div>;
  if(status == "unauthenticated") redirect("/login");

  return (
    <div className='md:flex'>
      <div className='hidden md:block h-screen md:min-w-44 lg:min-w-60 border-r-2 border-gray-600/15'>
        <Sidenav session={session} isLister={isLister} />
      </div>
      <div className="w-full">
        <div className="md:flex md:flex-row justify-between">
          <div className={`w-full ${id ? 'hidden md:block' : 'block'}`}>
            <ViewAllMessages session={session} isLister={isLister} thisLister={lister}/>
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