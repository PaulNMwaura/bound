"use client";

import { useEffect, useState } from "react";

export const Reviews = ({ reviews }) => {

    return (
        <section className="py-4">
            <div className="container text-black">
                <div className="flex flex-col justify-center items-center gap-6 lg:gap-10">
                    {reviews.length === 0 ? (
                    <p className="text-gray-500">No reviews yet</p>
                    ) : (
                    reviews.map((review, index) => (
                        <div
                        key={index}
                        className="w-full lg:w-3/4 bg-[#ABEEFF] rounded-lg p-5 shadow-md"
                        >
                            <div className="flex flex-row gap-4 items-center">
                                {/* Profile Picture Placeholder */}
                                {/* <div className="w-16 h-16 rounded-full bg-[#D9D9D9]"></div> */}
                                <div className="flex flex-col justify-start">
                                    <div className="text-md md:text-lg lg:text-xl font-semibold">
                                        {review.reviewerName}
                                    </div>
                                    <div className="text-yellow-500 text-sm md:text-md mt-1">⭐ {review.rating}/5</div>
                                    <div className="text-xs md:text-md lg:text-lg text-gray-600">
                                        {review.review}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                    )}
                </div>
            </div>
        </section>
    );
};