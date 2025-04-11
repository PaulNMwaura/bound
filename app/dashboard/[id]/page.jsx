"use client";
// import { useState, useEffect } from "react";
import { Hero } from "@/sections/listerDashboardPage/Hero";
import { Header }from "@/sections/listerDashboardPage/Header";
import { Information } from "@/sections/listerDashboardPage/Information";
import { Sidenav } from "@/sections/listerDashboardPage/Sidenav";
import Calendar from "@/components/DashboardCalendar";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function Dashboard({params}) {
  const { id } = React.use(params);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    async function fetchAppointments() {
      const response = await fetch(`/api/appointments/${id}`);
      const data = await response.json();
      setAppointments(data);
    }

    fetchAppointments();
  }, []);

  const { data: session } = useSession();

  return (
    <div>
      <div className="flex flex-row bg-white text-black">
        <div className="fixed hidden h-screen md:block md:min-w-44 lg:min-w-60 border-r-4" >
          <Sidenav session={session} />
        </div>
        <div className="md:ml-44 lg:ml-60 flex flex-col w-full">
          <Header session={session}/>
          {/* <Information /> */}
          <Calendar appointments={appointments} listerId={id} />
          <Hero appointments={appointments} listerId={id} session={session}/>
        </div>
      </div>
    </div>
  );
};