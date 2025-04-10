"use client";

import { Information } from "@/sections/viewListerPage/Information";
import { Hero } from "@/sections/viewListerPage/Hero";
import { Catalog } from "@/sections/viewListerPage/Catalog";
import { Header } from "@/sections/viewListerPage/Header";
import { Reviews } from "@/sections/viewListerPage/Reviews";
import { Selections } from "@/sections/viewListerPage/Selections";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function listerPage ({params}) {
  const [thisLister, setLister] = useState(null);
  const {id} = React.use(params);
  // console.log("id: ", id);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session } = useSession(); // Get logged-in user session
  const [posts, setPosts] = useState([]);

  // Fetch photos for this lister when the component mounts
  useEffect(() => {
    const fetchPhotos = async () => {
        try {
        const res = await fetch(`/api/photos/list/${thisLister._id}`);
        const data = await res.json();
        setPosts(data.photos.map((photo) => ({ url: photo.photo })));
        } catch (err) {
        console.error("Error loading photos:", err);
        }
    };

    if (thisLister?._id) {
        fetchPhotos();
    }
  }, [thisLister?._id]);
  
  useEffect(() => {
    // Fetch lister data when component mounts
    const fetchLister = async () => {
      try {
        const response = await fetch(`/api/listers/findListers/${id}`);
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
  
  const isLister = session?.user?.id === thisLister.userId;

  return (
    <div className="bg-[#D9D9D9] flex flex-col items-center pb-10">
      <div className="w-full">
        <Header id={id} thisLister={thisLister}/>
      </div>
      <div className="md:container md:w-[90%] bg-white md:mt-10 md:rounded-lg pb-20">
        <Hero id={id} thisLister={thisLister} />
        <Information id={id} thisLister={thisLister} />
        <Catalog firstname={"NAME"} isLister={isLister} thisLister={thisLister} posts={posts} setPosts={setPosts}/>
        <Reviews listerId={thisLister._id}/>
      </div>
    </div>
  );
};