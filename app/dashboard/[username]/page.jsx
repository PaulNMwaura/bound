import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Hero } from "@/sections/listerDashboardPage/Hero";
import { Header } from "@/sections/listerDashboardPage/Header";
import { Sidenav } from "@/sections/listerDashboardPage/Sidenav";
import Calendar from "@/components/DashboardCalendar";
import { authOptions } from "@/app/api/auth/auth.config";
import { connectMongoDB } from "@/lib/mongodb";
import Lister from "@/models/lister";
import Appointment from "@/models/appointment";


async function getLister(username) {
  await connectMongoDB();

  try {
    const lister = await Lister.findOne({username: username}).lean();
    return lister;
  } catch (err) {
    console.error('Failed to fetch lister:', err);
    return null;
  }
}

async function getAppointments(listerId) {
  await connectMongoDB();

  try {
    const appointments = await Appointment.find({ listerId }).lean();
    return appointments;
  } catch (err) {
    console.error('Failed to fetch appointments:', err);
    return [];
  }
}

export default async function Dashboard({ params }) {
  const {username} = await params;
  const session = await getServerSession(authOptions);
  const lister = await getLister(username);
  const thisListerId = lister._id.toString();

  if(!session || !lister)
    return <div>Loading...</div>
  
  if (session.user.id !== lister.userId.toString()) {
    return redirect("/unauthorized");
  }

  const appointments = await getAppointments(thisListerId);

  return (
    <div className="flex flex-row bg-white text-black">
      <div className="fixed hidden h-screen md:block md:min-w-44 lg:min-w-60 border-r-4">
        <Sidenav session={session} id={thisListerId}/>
      </div>
      <div className="md:ml-44 lg:ml-60 flex flex-col w-full">
        <Header session={session} profilePicture={lister.profilePicture} />
        <Calendar appointments={appointments} listerId={thisListerId} />
        <Hero appointments={appointments} listerId={thisListerId} session={session} />
      </div>
    </div>
  );
}
