// Lister's personal page.
"use client";

import { Information } from "@/sections/viewListerPage/Information";
import { Hero } from "@/sections/viewListerPage/Hero";
import { Catalog } from "@/sections/viewListerPage/Catalog";
import { Header } from "@/sections/viewListerPage/Header";
import { Reviews } from "@/sections/viewListerPage/Reviews";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { notFound } from 'next/navigation';

const RESERVED_ROUTES = ['applyLister', 'messages', 'dashboard'];

export default function listerPage ({params}) {

  if (RESERVED_ROUTES.includes(params.slug)) {
    return notFound();
  }

  const [thisLister, setLister] = useState(null);
  const {username} = React.use(params);
  const [editingEnabled, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session, status } = useSession();
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
        const response = await fetch(`/api/listers/findListers/${username}`);
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
  }, [username]);

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
  }, [thisLister?._id]);

  const toggleEditing = () => {
    setEditing(!editingEnabled);
  }

  
  if (loading) return <div className="heads-up">Loading...</div>;
  if (!thisLister) return <div className="heads-up">This lister does not exist</div>;
  
  const isLister = session?.user?.id === thisLister.userId;
  // console.log("Viewing Lister: ", thisLister);

  return (
    <div className="bg-[#D9D9D9] flex flex-col items-center pb-10">
      <div className="w-full">
        <Header id={thisLister._id} thisLister={thisLister} sessionStatus={status}/>
      </div>
      <div className="container bg-white h-fit md:h-fit md:mt-10 rounded-lg pb-20">
        <Hero id={thisLister._id} thisLister={thisLister} session={session} sessionStatus={status}/>
        <Information id={thisLister._id} isLister={isLister} thisLister={thisLister} editingEnabled={editingEnabled} toggleEditing={toggleEditing} sessionStatus={status}/>
        <Catalog firstname={thisLister.firstname} isLister={isLister} thisLister={thisLister} posts={posts} setPosts={setPosts}/>
        <Reviews reviews={reviews}/>
      </div>
    </div>
  );
};