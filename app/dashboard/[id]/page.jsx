// "use client";
// import { useState, useEffect } from "react";
import { Hero } from "@/app/sections/listerDashboard/Hero";
import { Header } from "@/app/sections/listerDashboard/Header";
import { Information } from "@/app/sections/listerDashboard/Information";
import { Navbar } from "@/app/sections/listerDashboard/Navbar";
import Calendar from "@/app/components/dashboardCalendar";
import { appointments } from "@/app/appointmentTempData";

export default async function Dashboard({params}) {
  const { id } = await params;

  return (
    <div>
      <div className="flex flex-row">
        <div className="fixed hidden h-screen md:block md:min-w-44 lg:min-w-60 bg-[#740A90] border-r-4" >
          <Navbar />
        </div>
        <div className="md:ml-44 lg:ml-60 flex flex-col w-full">
          <Header />
          <Information />
          <Calendar appointments={appointments}/>
          <Hero listerId={id} />  {/*now we just have to make sure api calls are working correctly.*/}
        </div>
      </div>
    </div>
  );
};
