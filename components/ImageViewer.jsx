"use client";

import Image from "next/image";

export function ImageViewer({ isOpen, onClose, imageUrl }) {
  if (!isOpen || !imageUrl) return null;

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/90 flex justify-center items-center"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 transition"
        onClick={onClose}
      >
        ✕
      </button>

      <div className="relative max-w-5xl max-h-[90vh] w-full h-[90vh] px-4">
        <Image
          src={imageUrl}
          alt="Full screen view"
          fill
          className="object-contain rounded-lg"
        />
      </div>
    </div>
  );
}
