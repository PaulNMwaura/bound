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
  if(isLister)
    console.log("session: ", session.user.id, "\nlister's User ID: ", thisLister.userId);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  return (
    <>
      <section>
        <div className="container lg:max-w-[90%]">
          {/*On sm width, we flex by column and justify between. On md we flex row and center items */}
          <div className="flex flex-col justify-between md:flex-row md:items-center">
            <div className="pt-2 flex justify-between">
              <div>
                <Image src={Logo} alt="Logo place holder" width={60} height={60}/>
              </div>
              <div className="flex items-center gap-2 md:hidden ">
                <IoMenu onClick={toggleSidebar} size={25}/>
              </div>
            </div>
            <div className="hidden md:flex md:text-xs border border-black rounded-lg p-2">
              <button onClick={() => router.replace(`/dashboard/${thisLister._id}`)}>My Dashboard</button>
            </div>
          </div>
        </div>
      </section>
      <ViewPageSidebar isLister={isLister} id={thisLister._id} isOpen={isSidebarOpen} onClose={toggleSidebar} />
    </>
  );
};