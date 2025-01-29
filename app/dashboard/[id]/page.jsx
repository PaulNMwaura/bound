// "use client";
// import { useState, useEffect } from "react";
import { Hero } from "@/app/sections/listerDashboard/Hero";
import { Header } from "@/app/sections/listerDashboard/Header";
import { Information } from "@/app/sections/listerDashboard/Information";
import { Navbar } from "@/app/sections/listerDashboard/Navbar";

export default async function Dashboard({params}) {
  const { id } = await params;

  return (
    <>
      <div className="flex flex-row">
        <div className="hidden md:block md:min-w-60 lg:min-w-60 h-screen bg-[#740A90] border-r-4" >
          <Navbar />
        </div>
        <div className="flex flex-col w-screen">
          <Header />
          <Information />
          <Hero listerId={id} />  {/*now we just have to make sure api calls are working correctly.*/}
        </div>
      </div>
    </>
  );
};
