"use client";
// import { useState, useEffect } from "react";
import { Hero } from "@/app/sections/listerDashboard/Hero";
import { Header }from "@/app/sections/listerDashboard/Header";
import { Information } from "@/app/sections/listerDashboard/Information";
import { Sidenav } from "@/app/sections/listerDashboard/Sidenav";
import Calendar from "@/app/components/dashboardCalendar";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { appointments } from "@/app/appointmentTempData";

export default function Dashboard({params}) {
  const { id } = React.use(params);
  // const [appointments, setAppointments] = useState([]);

  // useEffect(() => {
  //   async function fetchAppointments() {
  //     const response = await fetch(`/api/appointments/${id}`);
  //     const data = await response.json();
  //     console.log("appointments:  ", data);
  //     setAppointments(data);
  //   }

  //   fetchAppointments();
  // }, []);

  const { data: session } = useSession();

  return (
    <div>
      <div className="flex flex-row">
        <div className="fixed hidden h-screen md:block md:min-w-44 lg:min-w-60 bg-[#740A90] border-r-4" >
          <Sidenav session={session} />
        </div>
        <div className="md:ml-44 lg:ml-60 flex flex-col w-full">
          <Header session={session}/>
          {/* <Information /> */}
          <Calendar appointments={appointments} onCancel={(date) => console.log("Canceling appointment on", date)} />
          <Hero appointments={appointments} listerId={id} />  {/*now we just have to make sure api calls are working correctly.*/}
        </div>
      </div>
    </div>
  );
};
