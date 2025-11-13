"use client";

import { useRef, useState } from "react";

export function UploadImage({ isOpen, onClose, thisLister, setPosts }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [assignedService, setAssignedService] = useState("");

  if (!isOpen) return null;

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !assignedService) {
      alert("Please select a service before uploading.");
      return;
    }

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
          service: assignedService,
        }),
      });

      if (res.ok) {
        const updated = await fetch(`/api/photos/list/${thisLister._id}`);
        const imageUrl = cloudinaryData.secure_url.replace("/upload/", "/upload/h_1920,c_limit/" );
        const data = await updated.json();
        setPosts(
          data.photos.map((photo) => ({
            url: photo.photo,
            service: photo.service,
          }))
        );
      } else {
        console.error("Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-92 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-lg font-semibold mb-4 text-center text-black">
          Upload Image
        </h2>

        <div className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="service"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Assign image to:
            </label>
            <select
              id="service"
              name="service"
              className="border border-gray-300 rounded p-2 w-full text-sm text-black"
              value={assignedService}
              onChange={(e) => setAssignedService(e.target.value)}
              required
            >
              <option value="">-- Select a service --</option>
              {thisLister?.services?.map((service, index) => (
                <option key={index} value={service.name}>
                  {service.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col items-center justify-center gap-3">
            <button
              onClick={() => fileInputRef.current.click()}
              className="btn btn-primary px-4 py-2 rounded transition w-full"
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Choose File"}
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
