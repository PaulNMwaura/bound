// Lister's personal page.
"use client";

import { Information } from "@/sections/viewListerPage/Information";
import { Hero } from "@/sections/viewListerPage/Hero";
import { Catalog } from "@/sections/viewListerPage/Catalog";
import { Header } from "@/sections/viewListerPage/Header";
import { Reviews } from "@/sections/viewListerPage/Reviews";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
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


  // Fetch photos for this lister when the component mounts
  useEffect(() => {
    const fetchPhotos = async () => {
        setLoading(true);
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
    openAppointmentForm(searchParams.get("appointment") === "true");
  }, [searchParams]);

  const openPopup = (string) => {
    router.push(`?${string}=true`);
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

  const toggleEditing = () => {
    setEditing(!editingEnabled);
  }
  
  if (loading) return <div className="heads-up">Loading...</div>;
  if (!thisLister) return <div className="heads-up">This lister does not exist</div>;
  
  const isLister = session?.user?.id === thisLister.userId;
  // console.log("Viewing Lister: ", thisLister);

  return (
    <div className="min-h-screen max-h-fit bg-white flex flex-col items-center pb-10">
      <div className="w-full">
        <Header id={thisLister._id} thisLister={thisLister} sessionStatus={status}/>
      </div>
      <div className="w-full pb-20">
        <Hero id={thisLister._id} thisLister={thisLister} session={session} sessionStatus={status}/>
        {/* <Information id={thisLister._id} isLister={isLister} thisLister={thisLister} editingEnabled={editingEnabled} toggleEditing={toggleEditing} sessionStatus={status}/> */}
        <Catalog firstname={thisLister.firstname} isLister={isLister} thisLister={thisLister} posts={posts} setPosts={setPosts}/>
        {/* <Reviews reviews={reviews}/> */}
      </div>
      <button className={formOpen ? `hidden`: `z-10 fixed bottom-10 right-8 btn btn-primary`} onClick={()=>openPopup("appointment")}>
        Request appointment
      </button>
      {formOpen && ( 
        <div
          className="fixed inset-0 backdrop-blur-md bg-black/2 flex items-center justify-center z-10"
          onClick={closePopup}
        >
          <form className="bg-white shadow-[0_35px_35px_rgba(0,0,0,0.25)] rounded-sm w-fit h-fit flex flex-col gap-5 items-center py-7 px-10 text-black" onClick={(e) => e.stopPropagation()}>
              <strong>Fill this form in to request your appointment with {thisLister.firstname}</strong>
              {/* First Name */}
              <div className="flex flex-col space-y-2">
                <label className="font-medium">First Name</label> 
                <input type="text" name="firstname" className="border border-black/25 p-2 w-[300px] text-xs" value={formData.firstname} onChange={handleChange} required />
              </div>
              {/* Last Name */}
              <div className="flex flex-col space-y-2">
                <label className="font-medium">Last Name</label> 
                <input type="text" name="lastname" className="border border-black/25 p-2 w-[300px] text-xs" value={formData.lastname} onChange={handleChange} required />
              </div>
              {/* Email */}
              <div className="flex flex-col space-y-2">
                <label className="font-medium">Email</label> 
                <input type="text" name="email" className="border border-black/25 p-2 w-[300px] text-xs" value={formData.email} onChange={handleChange} required />
              </div>
              {/* Services (Multi-select) */}
              <div className="flex flex-col space-y-2">
                <label className="font-medium">Select Service(s)</label>
                <select name="services" multiple className="border border-black/25 p-2 w-[300px] text-xs h-fit" value={formData.services} onChange={handleChange} required >
                  {thisLister.services.map((service, index) => (
                    <option key={index} value="" className="p-1">
                      {service.name}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-gray-500">
                  Hold <kbd>Ctrl</kbd> (or <kbd>Cmd</kbd> on Mac) to select multiple.
                </p>
              </div>
              {/* Date */}
              <div className="flex flex-col space-y-2">
                <label className="font-medium">Select Date</label>
                <input type="date" name="date" min={today} className="border border-black/25 p-2 w-[300px] text-xs" value={formData.date} onChange={handleChange} required />
              </div>
              {/* Time */}
              <div className="flex flex-col space-y-2">
                <label className="font-medium">Select Time</label>
                <input disabled={!formData.date} type="time" name="time" className="border border-black/25 p-2 w-[300px] text-xs" value={formData.time} onChange={handleChange} required />
              </div>
              <div className="mt-auto w-full flex justify-between">
                <button type="button" className="text-black font-medium" onClick={closePopup}>
                  Close
                </button>
                <button type="button" className="btn btn-primary">
                  Next
                </button>
              </div>
          </form>
        </div>
      )}
    </div>
  );
};