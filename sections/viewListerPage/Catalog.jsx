import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { MdDelete } from "react-icons/md";
import { ImageViewer } from "@/components/ImageViewer";

export const Catalog = ({ firstname, isLister, thisLister, posts, setPosts }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [currentTab, setCurrentTab] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // 🖼️ Fullscreen viewer
  const searchParams = useSearchParams();

  const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;
  const photosPerPage = isMobile ? 1 : 3;

  const filteredPosts = posts.filter((post) => {
    if (!currentTab || currentTab === "All") return true;
    return post.service === currentTab;
  });

  useEffect(() => {
    let tab = searchParams.get("tab");
    if (tab == null) tab = "All";
    setCurrentTab(tab);
  }, [searchParams]);

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

  return (
    <section>
      <div className="mt-2 pb-5">
        <div
          className="container mx-auto"
          style={{
            columnCount: isMobile ? 3 : 5,
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
                  width: "100%",
                }}
              >
                <div className="relative w-full break-inside-avoid mb-0 rounded-lg group">
                  <Image
                    src={url}
                    alt="a lister's post"
                    width={360}
                    height={640}
                    className="w-full h-auto object-contain rounded-lg cursor-pointer"
                    onClick={() => setSelectedImage(url)} // 👈 Opens fullscreen
                  />

                  {isLister && (
                    <button
                      onClick={() => handleDeletePost(url)}
                      className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full opacity-60 md:opacity-0 md:group-hover:opacity-100 transition"
                    >
                      <MdDelete
                        size={
                          typeof window !== "undefined" && window.innerWidth < 1024 ? 10 : 20
                        }
                      />
                    </button>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Fullscreen Image Viewer */}
      <ImageViewer
        isOpen={!!selectedImage}
        imageUrl={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </section>
  );
};
