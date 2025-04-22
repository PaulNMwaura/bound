"use client";
import { useState } from "react";
import { EditProfile } from "./EditProfile";
import { EditListerProfile } from "./EditListerProfile";

export const Hero = ({ session, isLister, thisLister }) => {
  const [editingProfile, setEditingProfile] = useState(true); // true = editing profile

  const switchToProfile = () => setEditingProfile(true);
  const switchToLister = () => setEditingProfile(false);

  return (
    <section className="container max-w-[90%] min-h-[90%]">
      {isLister && (
        <div className="flex gap-3">
          <button
            onClick={switchToProfile}
            disabled={editingProfile}
            className={`px-3 py-1 rounded-t ${
              editingProfile ? "bg-white text-black" : "bg-[#2c2c2c] text-white"
            }`}
          >
            Edit profile
          </button>

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
        </div>
      )}

      <div className="bg-white text-black p-4 rounded-b rounded-tr py-10">
        {editingProfile ? (
            <EditProfile session={session}/>
        ):( 
            <EditListerProfile thisLister={thisLister} />
        )}
      </div>
    </section>
  );
};
