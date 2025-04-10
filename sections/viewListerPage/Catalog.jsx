"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";

export const Catalog = ({ firstname, isLister, thisLister, posts, setPosts }) => {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;
  const photosPerPage = isMobile ? 1 : 3;
  const totalPages = Math.ceil(posts.length / photosPerPage);

  const currentPosts = posts.slice(
    currentPage * photosPerPage,
    currentPage * photosPerPage + photosPerPage
  );

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "ml_default");

      const cloudinaryRes = await fetch("https://api.cloudinary.com/v1_1/djreop8la/image/upload", {
        method: "POST",
        body: formData,
      });

      const cloudinaryData = await cloudinaryRes.json();
      const imageUrl = cloudinaryData.secure_url;

      const res = await fetch("/api/photos/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listerId: thisLister._id,
          photo: imageUrl,
        }),
      });

      if (res.ok) {
        const updated = await fetch(`/api/photos/list/${thisLister._id}`);
        const data = await updated.json();
        setPosts(data.photos.map((photo) => ({ url: photo.photo })));
        setCurrentPage(0);
      } else {
        console.error("Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleSwipe = (direction) => {
    if (direction === "left" && currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
    } else if (direction === "right" && currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <section>
      <div className="pt-10 pb-20">
        <div className="flex flex-col gap-5 justify-center items-center">
          <div className="section-title text-xs md:text-md xl:text-2xl">
            {thisLister.firstname}&apos;s Work
          </div>

          <div className="relative w-fit">
            <div
              className="pt-10 pb-20 flex flex-wrap justify-center items-center gap-3 bg-[#F3F3F3] rounded-lg px-10 min-w-[300px] min-h-[400px]"
              onTouchStart={(e) => (window.touchStartX = e.changedTouches[0].clientX)}
              onTouchEnd={(e) => {
                const delta = e.changedTouches[0].clientX - window.touchStartX;
                if (Math.abs(delta) > 50) handleSwipe(delta < 0 ? "left" : "right");
              }}
            >
              {currentPosts.length === 0 ? (
                <p className="text-gray-500">No posts yet.</p>
              ) : (
                currentPosts.map(({ url }, index) => (
                  <div
                    key={index}
                    className="w-full md:w-[360px] h-auto aspect-video transition transform duration-300"
                  >
                    <Image
                      src={url}
                      alt="a lister's post"
                      width={1080}
                      height={1920}
                      className="w-[225px] h-[400px] md:w-[360px] md:h-[640px] object-cover rounded-lg"
                    />
                  </div>
                ))
              )}
            </div>

            {/* Upload Button */}
            {isLister && (
              <div className={`absolute ${totalPages == 1 ? "bottom-4" : "bottom-15"} left-1/2 transform -translate-x-1/2`}>
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="bg-black text-white px-4 py-2 text-sm rounded hover:bg-gray-800 transition"
                  disabled={uploading}
                >
                  {uploading ? "Uploading..." : "Upload Image"}
                </button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            )}

            {/* Pagination Controls */}
            {!isMobile && totalPages > 1 && (
              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))}
                  disabled={currentPage === 0}
                  className="text-sm bg-black px-3 py-1 rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages - 1))}
                  disabled={currentPage >= totalPages - 1}
                  className="text-sm bg-black px-3 py-1 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}

            {isMobile && totalPages > 1 && (
              <div className="text-black flex justify-center items-center gap-2 mt-4">
                <BiSolidLeftArrow onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages - 1))}/>
                  View more
                <BiSolidRightArrow onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))}/>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
