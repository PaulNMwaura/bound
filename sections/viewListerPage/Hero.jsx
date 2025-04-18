"use client";

import { useState } from "react";
import Logo from "@/assets/logo-holder.png";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { IoMdMail, IoMdStar } from "react-icons/io";
import { BiSolidCommentEdit } from "react-icons/bi";
import { RiAlertFill } from "react-icons/ri";

export const Hero = ({ id, thisLister}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewError, setReviewError] = useState(null);
  const { data: session } = useSession(); // Get logged-in user session
  // At top of Hero.jsx
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [submitLoading, setSubmitLoading] = useState(false);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!thisLister) {
    return <div>No lister found</div>;
  }

  const profileImage = thisLister.imageBase64
  ? thisLister.imageBase64
  : Logo;

  const isLister = session?.user?.id === thisLister.userId;
  
  const handleSubmitReview = async () => {
    if (!review || rating < 1 || rating > 5) return setReviewError("Enter valid review and rating");
    setSubmitLoading(true);

    try {
      const res = await fetch("/api/listers/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listerId: thisLister._id,
          reviewerName: session?.user?.firstname || "Anonymous",
          review,
          rating,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setShowReviewForm(false);
        setReview("");
        setRating(0);
        window.location.reload();
      } else {
        setReviewError(data.message);
      }
    } catch (err) {
      alert("Failed to submit review.");
    } finally {
      setSubmitLoading(false);
    }
  };

    return (
      <section className="py-10">
        <div className="container text-black lg:max-w-[80%]">
          <div className="text-sm md:text-lg">
            <div className="flex flex-col md:flex-row items-center md:gap-10">

              {/* Lister's profile picture and rating */}
              <div className="flex flex-col items-center gap-2">
                <Image src={thisLister.profilePicture || Logo} alt="Profile picture goes here" height={100} width={100} className="rounded-full object-cover" style={{ aspectRatio: 1 }}/>
                <div className="flex flex-row justify-center items-center w-full">
                  <IoMdStar size={22}/>
                  {thisLister.rating ? (
                    <p className="font-medium">{thisLister.rating}/5</p>
                  ):(
                    <p className="font-medium">{"0"}/5</p>
                  )}
                </div>
              </div>

              {/* Lister's information (Name, Description, Location) */}
              <div className="w-full">
                <div className="flex justify-between items-center font-semibold border border-[#B5B5B5] rounded-lg px-3 mb-2">
                  <div className="flex flex-row space-x-1">
                    <a className="font-semibold">
                      {thisLister.firstname} {thisLister.lastname} 
                    </a>
                    <span className="hidden md:block font-light"> |</span>
                    <a className="font-light text-black/40">@{thisLister.username}</a>
                    <a className="font-light">{thisLister.language ? `| ${thisLister.language}` : "| English"}</a>
                  </div>
                  <a>{thisLister.city}, {thisLister.state}</a>
                </div>
                <div>
                  {thisLister.description}
                </div>

                {/* Message and reviews buttons*/}
                {!isLister && (
                <div className="mt-4 w-full flex justify-between text-xs md:text-lg">
                  <div className="flex -space-x-2 items-center">
                    <IoMdMail size={22}/>
                    <button className="btn hover:cursor-pointer">Message</button>
                  </div>
                    <div className="flex -space-x-2 items-center">
                      <BiSolidCommentEdit size={22} />
                      <button className="btn hover:cursor-pointer" onClick={() => setShowReviewForm(true)}>
                      Review
                      </button>
                    </div>
                    <div className="flex -space-x-2 items-center">
                      <RiAlertFill size={22} />
                      <button className="btn">Report</button>
                    </div>
                </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {showReviewForm && (
          <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-50 text-black">
            <div className="bg-white rounded-xl p-6 w-11/12 md:w-[600px] shadow-xl">
              <h3 className="text-lg font-semibold mb-3">Leave a Review</h3>
              <textarea
                className="w-full p-2 border rounded mb-3"
                rows="5"
                placeholder="Write your review..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
              />
              <h3 className="text-md font-semibold mb-3">Rating (1 - 5)</h3>
              <input
                type="number"
                min="1"
                max="5"
                value={rating}
                onChange={(e) => setRating(parseInt(e.target.value))}
                className="w-full p-2 border rounded mb-4"
                placeholder="Enter a rating"
              />
              {reviewError && (
                <div className="w-fit px-3 text-white bg-red-500 rounded">{reviewError}</div>
              )}
              <div className="flex justify-between">
                <button
                  onClick={() => setShowReviewForm(false)}
                  className="text-gray-600 hover:underline"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitReview}
                  disabled={submitLoading}
                  className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                >
                  {submitLoading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    );
};