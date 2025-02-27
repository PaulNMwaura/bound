"use client";
import Logo from "@/app/assets/BoundLogo.png";
import Image from "next/image";
import {ViewPageSidebar} from "@/app/components/ViewPageSidebar";
import { useRouter } from "next/navigation";
import { useState, useEffect} from "react";
import { useSession } from "next-auth/react";
import { IoMenu } from "react-icons/io5";

export const Header = ({ id }) => {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar visibility state
  const [thisLister, setLister] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session } = useSession(); // Get logged-in user session
  useEffect(() => {
    // Fetch lister data when component mounts
    const fetchLister = async () => {
      try {
        const response = await fetch(`/api/findListers/${id}`);
        if (!response.ok) {
          throw new Error('Lister not found');
        }
        const data = await response.json();
        // console.log("data: ", data.lister);
        setLister(data.lister);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLister();
  }, [id]);
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!thisLister) return <div>No lister found</div>;

  // console.log("session: ", session);
  const isLister = session?.user?.id === thisLister.userId;
  // if(isLister)
  //   console.log("session: ", session.user.id, "\nlister's User ID: ", thisLister.userId);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  return (
    <>
      <section>
        <div className="container md:w-[90%] md:bg-white md:rounded-b-xl">
            <div className="py-1 flex justify-between items-center">
              <div>
                <p className="">Hello {session?.user?.firstname}!</p>
                {/* <Image src={Logo} alt="Logo place holder" width={60} height={60}/> */}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex flex-row items-center">
                  <a href="/" className="btn hidden lg:block">Home</a>
                  <a href="/browse" className="btn hidden lg:block">Browse</a>
                  {isLister && (
                    <button onClick={() => router.replace(`/dashboard/${thisLister._id}`)} className="btn hidden lg:block">My Dashboard</button>
                  )}
                  <p className="btn">Sign out</p>
                </div>
                <div className="block lg:hidden">
                  <IoMenu onClick={toggleSidebar} size={25}/>
                </div>
              </div>
            </div>
          </div>
      </section>
      <ViewPageSidebar isLister={isLister} id={thisLister._id} isOpen={isSidebarOpen} onClose={toggleSidebar} />
    </>
  );
};