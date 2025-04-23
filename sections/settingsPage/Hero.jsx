"use client";
import { useState, useRef, useEffect } from "react";
import { EditProfile } from "./EditProfile";
import { EditListerProfile } from "./EditListerProfile";
import { IoMenu } from "react-icons/io5";
import { Sidenav } from "@/sections/settingsPage/Sidenav";

export const Hero = ({ session, isLister, thisLister }) => {
  const [editingProfile, setEditingProfile] = useState(true);
  const [isSidenavOpen, setOpenSidenav] = useState(false);
  const sidenavRef = useRef();

  const switchToProfile = () => setEditingProfile(true);
  const switchToLister = () => setEditingProfile(false);

  // 🔄 Close sidenav when clicking outside of it
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        isSidenavOpen &&
        sidenavRef.current &&
        !sidenavRef.current.contains(event.target)
      ) {
        setOpenSidenav(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isSidenavOpen]);

  return (
    <section className="w-full md:container md:max-w-[90%]">
      <div className="flex justify-between px-4 md:px-0">
        <div className="flex gap-3">
          <button
            onClick={switchToProfile}
            disabled={editingProfile}
            className={`px-3 py-1 rounded-t ${
              editingProfile
                ? "bg-white text-black"
                : "bg-[#2c2c2c] text-white"
            }`}
          >
            Edit profile
          </button>

          {isLister && (
            <button
              onClick={switchToLister}
              disabled={!editingProfile}
              className={`px-3 py-1 rounded-t ${
                !editingProfile
                  ? "bg-white text-black"
                  : "bg-[#2c2c2c] text-white"
              }`}
            >
              Edit lister profile
            </button>
          )}
        </div>

        <div className="block md:hidden" onClick={() => setOpenSidenav(true)}>
          <IoMenu size={24} />
        </div>
      </div>

      <div className="bg-white text-black rounded-b rounded-tr py-10">
        {editingProfile ? (
          <EditProfile isLister={isLister} thisLister={thisLister} />
        ) : (
          <EditListerProfile thisLister={thisLister} />
        )}
      </div>

      {isSidenavOpen && (
        <>
          {/* Backdrop to visually dim background */}
          <div className="fixed inset-0 bg-black/30 bg-opacity-40 z-40" />

          {/* Sidenav container */}
          <div
            ref={sidenavRef}
            className={`fixed top-0 left-0 w-[50%] h-full bg-white z-50 transition-transform duration-300 rounded-r-lg`}
          >
            <Sidenav session={session} isLister={isLister} />
          </div>
        </>
      )}
    </section>
  );
};
