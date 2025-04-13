"use client";

import { Information } from "@/sections/viewListerPage/Information";
import { Hero } from "@/sections/viewListerPage/Hero";
import { Catalog } from "@/sections/viewListerPage/Catalog";
import { Header } from "@/sections/viewListerPage/Header";
import { Reviews } from "@/sections/viewListerPage/Reviews";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function listerPage ({params}) {
  const [thisLister, setLister] = useState(null);
  const {id} = React.use(params);
  const [editingEnabled, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session } = useSession(); // Get logged-in user session
  const [posts, setPosts] = useState([]);
  const [reviews, setReviews] = useState([]);

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
        setLoading(false);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchLister();
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      const res = await fetch(`/api/listers/reviews/${thisLister._id}`);
      const data = await res.json();
      setReviews(data.reviews);

      setLister((prev) => ({
        ...prev,
        rating: parseFloat(data.averageRating),
      }));
    };

    if (thisLister?._id) fetchReviews();
    // Last thing to be loaded so it should finish the loading process.
  }, [thisLister?._id]);

  const toggleEditing = () => {
    setEditing(!editingEnabled);
  }

  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!thisLister) return <div>No lister found</div>;
  
  const isLister = session?.user?.id === thisLister.userId;

  return (
    <div className="bg-[#D9D9D9] flex flex-col items-center pb-10">
      <div className="w-full">
        <Header id={id} thisLister={thisLister}/>
      </div>
      <div className="container bg-white h-fit md:h-fit md:mt-10 md:rounded-lg pb-20">
        <Hero id={id} thisLister={thisLister} />
        <Information id={id} isLister={isLister} thisLister={thisLister} editingEnabled={editingEnabled} toggleEditing={toggleEditing} />
        <Catalog firstname={"NAME"} isLister={isLister} thisLister={thisLister} posts={posts} setPosts={setPosts}/>
        <Reviews reviews={reviews}/>
      </div>
    </div>
  );
};