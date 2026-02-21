"use client";

import Logo from "@/assets/logo-holder.png";
import Image from "next/image";
import { useState } from "react";
import ReportUser from "@/components/ReportUser";
import ReviewLister from "@/components/ReviewLister";
import { IoMdMail, IoMdStar } from "react-icons/io";
import { BiSolidCommentEdit } from "react-icons/bi";
import { RiAlertFill } from "react-icons/ri";
import { redirect } from "next/navigation";
import { UploadImage } from "@/components/UploadImage";


export const Hero = ({ thisLister, session, sessionStatus, posts, setPosts}) => {
  const [error, setError] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);


  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!thisLister) {
    return <div>No lister found</div>;
  }

  const isLister = session?.user?.id === thisLister.userId;

    return (
      <section className="py-10">
        <div className="container text-black lg:max-w-[80%]">
          <div className="text-sm md:text-lg">
            <div className="flex flex-col md:flex-row items-center md:gap-10">

              {/* Lister's profile picture and rating */}
              <div className="flex flex-col items-center gap-2">
                <Image src={thisLister.profilePicture || Logo} alt="Profile picture goes here" height={100} width={100} className="rounded-full object-cover" style={{ aspectRatio: 1 }}/>
                <div className="flex flex-row justify-center items-center w-full">
                  <IoMdStar size={22}/>
                  {thisLister.rating ? (
                    <p className="font-medium">{thisLister.rating}/5</p>
                  ):(
                    <p className="font-medium">{"0"}/5</p>
                  )}
                </div>
              </div>

              {/* Lister's information (Name, Description, Location) */}
              <div className="w-full">
                <div className="flex justify-between items-center font-semibold border border-[#B5B5B5] rounded-lg px-3 mb-2">
                  <div className="flex flex-row space-x-1">
                    <a className="font-semibold">
                      {thisLister.firstname} {thisLister.lastname} 
                    </a>
                    <span className="font-light"> |</span>
                    <a className="font-light text-black/40">@{thisLister.username}</a>
                    <a className="font-light">{thisLister.language ? `| ${thisLister.language}` : "| English"}</a>
                  </div>
                  <a className="hidden md:block">{thisLister.city}, {thisLister.state}</a>
                </div>
                <div className="whitespace-pre-line">
                  {thisLister.description}
                </div>

                {/* Message and reviews buttons*/}
                {!isLister ? (
                <div className="mt-4 w-full flex justify-between text-xs md:text-lg">
                  <div className="flex -space-x-2 items-center">
                    <IoMdMail size={22}/>
                    <button onClick={() => redirect(`/messages?id=${thisLister.userId}`)} className="btn hover:cursor-pointer">Message</button>
                  </div>
                  {sessionStatus == "authenticated" ? (
                    <div className="flex -space-x-2 items-center">
                      <BiSolidCommentEdit size={22} />
                      <button className="btn hover:cursor-pointer" onClick={() => setShowReviewForm(true)}>
                      Reviews
                      </button>
                    </div>
                  ):""}
                  {sessionStatus == "authenticated" ? (
                    <div className="flex -space-x-2 items-center">
                      <RiAlertFill size={22} />
                      <button className="btn hover:cursor-pointer" onClick={() => setShowReportForm(true)}>Report</button>
                    </div>
                  ):""}
                </div>
                ):(
                  <div className="mt-4 w-full flex justify-between text-xs md:text-lg gap-2">
                    <a href={`/dashboard/${thisLister.username}`} className="w-full text-black hover:text-white bg-black/5 p-1 font-medium rounded-lg text-sm text-center dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800">
                      Dashboard
                    </a>
                    <a href={"/settings"} className="w-full text-black hover:text-white bg-black/5 p-1 font-medium rounded-lg text-sm text-center dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800">
                      Edit Profile
                    </a>
                    <button type="button" className="w-full text-black hover:text-white bg-black/5 p-1 font-medium rounded-lg text-sm text-center dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800" onClick={() => setShowUploadModal(true)}>
                      Upload Image
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {showReportForm && (
          <ReportUser setShowReportForm={setShowReportForm} reportedUser={thisLister.username} reportedUserId={thisLister.userId} reporterId={session?.user?.id} />
        )}
        {showReviewForm && (
          <ReviewLister setShowReviewForm={setShowReviewForm} listerId={thisLister._id} reviewerName={session.user.firstname}/>
        )}

        {/* Upload Modal */}
        <UploadImage
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          thisLister={thisLister}
          setPosts={setPosts}
        />
      </section>
    );
};