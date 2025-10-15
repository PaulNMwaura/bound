"use client";
import { useState } from "react";

export default function ReviewLister({setShowReviewForm, listerId, reviewerName}){
    const [reviewError, setReviewError] = useState(null);
    const [review, setReview] = useState("");
    const [rating, setRating] = useState(0);
    const [submitLoading, setSubmitLoading] = useState(false);

    const handleSubmitReview = async () => {
      if (!review || rating < 1 || rating > 5)
        return setReviewError("Enter valid review and rating");
      setSubmitLoading(true);

      try {
        const res = await fetch("/api/listers/reviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            listerId,
            reviewerName,
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
      <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center text-black z-10">
        <div className="bg-white shadow-[0_35px_35px_rgba(0,0,0,0.25)] rounded-sm p-6 w-11/12 md:w-[600px]">
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
            <div className="w-fit px-3 text-white bg-red-500 rounded">
              {reviewError}
            </div>
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
    );
}