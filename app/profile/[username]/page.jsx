// Lister's personal page.
"use client";

import { Information } from "@/sections/viewListerPage/Information";
import { Hero } from "@/sections/viewListerPage/Hero";
import { Catalog } from "@/sections/viewListerPage/Catalog";
import { Header } from "@/sections/viewListerPage/Header";
import { AppointmentForm } from "@/components/AppointmentForm";
import { Reviews } from "@/sections/viewListerPage/Reviews";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useSearchParams, useRouter, redirect } from "next/navigation";
import { useMemo } from "react";
import { notFound } from 'next/navigation';

const RESERVED_ROUTES = ['applyLister', 'messages', 'dashboard'];

export default function listerPage ({params}) {

  if (RESERVED_ROUTES.includes(params.slug)) {
    return notFound();
  }

  const [thisLister, setLister] = useState(null);
  const {username} = React.use(params);
  const [editingEnabled, setEditing] = useState(false);
  const [formOpen, openAppointmentForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session, status } = useSession();
  const [posts, setPosts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname:  "",
    email: "",
    date: "",
    time: "",
    services: [],
  });
  const today = new Date().toISOString().split("T")[0];

  const handleChange = (e) => {
    const { name, value, options, multiple } = e.target;
    if (multiple) {
      // collect selected options as an array
      const selected = Array.from(options)
        .filter((o) => o.selected)
        .map((o) => o.value);
      setFormData((prev) => ({ ...prev, [name]: selected }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const [currentUrl, setCurrentUrl] = useState("")
    useEffect(() => {
      setCurrentUrl(window.location.href)
  }, [])

  // Fetch photos for this lister when the component mounts
  useEffect(() => {
    const fetchPhotos = async () => {
        setLoading(true);
        try {
        const res = await fetch(`/api/photos/list/${thisLister._id}`);
        const data = await res.json();
        setPosts(data.photos.map((photo) => ({ url: photo.photo, service: photo.service })));
        } catch (err) {
        console.error("Error loading photos:", err);
        }
    };

    if (thisLister?._id) {
        fetchPhotos();
        setLoading(false);
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

  useEffect(() => {
    openAppointmentForm(searchParams.get("appointment") === "request");
  }, [searchParams]);

  const openPopup = (string) => {
    router.push(`?${string}=request`);
  };

  const closePopup = () => {
    setFormData({
      firstname: "",
      lastname: "",
      email: "",
      date: "",
      time: "",
      services: [],
    });
    router.push("?", { scroll: false });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // handle submit logic
    console.log("Submitting:", formData);
  }

  const toggleEditing = () => {
    setEditing(!editingEnabled);
  }
  
  if (loading) return <div className="heads-up">Loading...</div>;
  if (!thisLister) return <div className="heads-up">This lister does not exist</div>;
  
  const isLister = session?.user?.id === thisLister.userId;
  console.log("This lister's id: ", thisLister._id);
  return (
    <div className="min-h-screen max-h-fit bg-white flex flex-col items-center pb-10">
      <div className="w-full">
        <Header id={thisLister._id} thisLister={thisLister} sessionStatus={status}/>
      </div>
      <div className="w-full pb-20">
        <Hero id={thisLister._id} thisLister={thisLister} session={session} sessionStatus={status}/>
        <Information id={thisLister._id} isLister={isLister} thisLister={thisLister} editingEnabled={editingEnabled} toggleEditing={toggleEditing} sessionStatus={status} posts={posts} setPosts={setPosts}/>
        <Catalog firstname={thisLister.firstname} isLister={isLister} thisLister={thisLister} posts={posts} setPosts={setPosts}/>
        {/* <Reviews reviews={reviews}/> */}
      </div>
      <button className={formOpen ? `hidden`:`z-10 fixed bottom-10 right-3 btn btn-primary hover:cursor-pointer text-xs sm:text-[14px]`} onClick={()=>{session ? openPopup("appointment") : redirect(`/login?callbackUrl=${currentUrl}`)}}>
        {session != null ? "Request Appointment":"Login to Request"}
      </button>
      {formOpen && thisLister && (
        <AppointmentForm
          lister={thisLister}
          formData={formData}
          onChange={handleChange}
          onClose={closePopup}
          onSubmit={handleSubmit}
          session={session}
        />
      )}
    </div>
  );
};