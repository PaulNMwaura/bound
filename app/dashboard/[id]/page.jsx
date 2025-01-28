// "use client";
// import { useState, useEffect } from "react";
import { Hero } from "@/app/sections/listerDashboard/Hero";
import { Navbar } from "@/app/sections/listerDashboard/Navbar";

export default async function Dashboard({params}) {
  const { id } = await params;

  return (
    <>
      <div className="flex flex-row">
        <div className="hidden md:block md:w-36 lg:w-48" >
          <Navbar />
        </div>
        <Hero listerId={id} />  {/*now we just have to make sure api calls are working correctly.*/}
      </div>
    </>
  );
};
