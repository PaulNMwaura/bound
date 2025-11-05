"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";
import { MdDelete } from "react-icons/md";

export const Catalog = ({ firstname, isLister, thisLister, posts, setPosts }) => {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentTab, setCurrentTab ] = useState(null);
  const searchParams = useSearchParams();

  const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;
  const photosPerPage = isMobile ? 1 : 3;
  const totalPages = Math.ceil(posts.length / photosPerPage);

  const currentPosts = posts.slice(
    currentPage * photosPerPage,
    currentPage * photosPerPage + photosPerPage
  );

  const filteredPosts = posts.filter((post) => {
    if (!currentTab || currentTab === "All") 
      return true; // show all
    return post.service === currentTab; // show only matching service
  });

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "ml_default");

      const cloudinaryRes = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

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

  const handleDeletePost = async (url) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;
  
    try {
      const res = await fetch("/api/photos/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listerId: thisLister._id, photoUrl: url }),
      });
  
      if (res.ok) {
        const updated = await fetch(`/api/photos/list/${thisLister._id}`);
        const data = await updated.json();
        setPosts(data.photos.map((photo) => ({ url: photo.photo })));
      } else {
        console.error("Failed to delete post");
      }
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  useEffect(() => {
    let tab = searchParams.get("tab");
    if(tab == null)
      tab = "All"
    setCurrentTab(tab);
  }, [searchParams]);
  

  const handleSwipe = (direction) => {
    if (direction === "left" && currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
    } else if (direction === "right" && currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <section>
      <div className="mt-2 pb-5">
        <div
          className="container mx-auto"
          style={{
            columnCount: typeof window !== "undefined" && window.innerWidth < 1024 ? 3 : 5,
            columnGap: "0.2rem",
          }}
        >
          {filteredPosts.length > 0 &&
            filteredPosts.map(({ url }, index) => (
              <div
                key={index}
                style={{
                  breakInside: "avoid",
                  marginBottom: "1rem",
                  borderRadius: "0.5rem",
                  position: "relative",
                  overflow: "hidden",
                  width: "100%", // fill the column width
                }}
              >
                
                <div
                  key={index}
                  className="relative w-full break-inside-avoid mb-0 rounded-lg group"
                >
                  <Image
                    src={url}
                    alt="a lister's post"
                    width={360}
                    height={640}
                    className="w-full h-auto object-contain rounded-lg"
                  />
                  {/* Move to Hero section? */}
                  {isLister && (
                    <button
                      onClick={() => handleDeletePost(url)}
                      className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full opacity-60 md:opacity-0 md:group-hover:opacity-100 transition"
                    >
                      <MdDelete size={typeof window !== "undefined" && window.innerWidth < 1024 ? 10 : 20} />
                    </button>
                  )}
                </div>
              </div>
            ))}
        </div>

        {/* Upload Button */}
      </div>
      {isLister && (
        <div
          className={`relative flex flex-col items-center justify-center left-1/2 transform -translate-x-1/2`}
        >
          <button className="btn btn-primary text-xs md:text-[16px]">
            Upload Image
            {/* onClick, this should open a pop up form for image upload, and service assignement for that image */}
          </button>
          {/* <button
            onClick={() => fileInputRef.current.click()}
            className="w-32 text-xs md:w-48 bg-black text-white px-4 py-2 md:text-sm rounded hover:bg-blue-500 transition"
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
          /> */}
        </div>
      )}
    </section>
  );
};
