"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export const Catalog = ({ firstname, isLister, thisLister }) => {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
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

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "ml_default"); // Replace with your actual preset

      const cloudinaryRes = await fetch("https://api.cloudinary.com/v1_1/djreop8la/image/upload", {
        method: "POST",
        body: formData,
      });

      const cloudinaryData = await cloudinaryRes.json();
      console.log(cloudinaryData);
      const imageUrl = cloudinaryData.secure_url;

      const apiRes = await fetch("/api/photos/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listerId: thisLister._id,
          photo: imageUrl,
        }),
      });

      
      if (res.ok) {
        // Fetch updated photos after upload
        const updated = await fetch(`/api/photos/list/${thisLister._id}`);
        const data = await updated.json();
        setPosts(data.photos.map((photo) => ({ url: photo.photo })));
      } else {
        console.error("Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <section>
      <div className="pt-10 pb-20">
        <div className="flex flex-col gap-5 justify-center items-center">
          <div className="section-title text-xs md:text-md xl:text-2xl">
            {thisLister.firstname}&apos;s Work
          </div>

          <div className="w-full md:w-fit relative">
            <div className="pt-10 pb-20 flex flex-col md:flex-row justify-center items-center gap-1 bg-[#F3F3F3] rounded-lg px-10 min-h-[400px]">
              {posts.length === 0 ? (
                <p className="text-gray-500">No posts yet.</p>
              ) : (
                posts.map(({ url }, index) => (
                  <div
                    key={index}
                    className="w-fit h-[400px] hover:scale-[1.01] transition transform duration-300"
                  >
                    <Image
                      src={url}
                      alt="a lister's post"
                      width={225}
                      height={400}
                      className="w-[225px] h-[400px] object-cover rounded-lg"
                    />
                  </div>
                ))
              )}
            </div>

            {isLister && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
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
          </div>
        </div>
      </div>
    </section>
  );
};
