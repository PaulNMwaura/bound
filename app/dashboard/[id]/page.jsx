import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Hero } from "@/sections/listerDashboardPage/Hero";
import { Header } from "@/sections/listerDashboardPage/Header";
import { Sidenav } from "@/sections/listerDashboardPage/Sidenav";
import Calendar from "@/components/DashboardCalendar";
import { authOptions } from "@/app/api/auth/auth.config";



async function getListerById(id) {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/listers/findListers/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;

  const data = await res.json();
  return data?.lister || null;
}

async function getAppointments(id) {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/appointments/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) return [];

  return res.json();
}

export default async function Dashboard({ params }) {
  const {id} = await params;
  const session = await getServerSession(authOptions);
  const lister = await getListerById(id);

  if(!session || !lister)
    return <div>Loading...</div>
  
  if (session.user.id !== lister.userId) {
    console.log(session.user.id, lister.userId);
    return redirect("/unauthorized"); // Create this page or change as needed
  }

  const appointments = await getAppointments(id);

  return (
    <div className="flex flex-row bg-white text-black">
      <div className="fixed hidden h-screen md:block md:min-w-44 lg:min-w-60 border-r-4">
        <Sidenav session={session} />
      </div>
      <div className="md:ml-44 lg:ml-60 flex flex-col w-full">
        <Header session={session} profilePicture={lister.profilePicture} />
        <Calendar appointments={appointments} listerId={id} />
        <Hero appointments={appointments} listerId={id} session={session} />
      </div>
    </div>
  );
}
