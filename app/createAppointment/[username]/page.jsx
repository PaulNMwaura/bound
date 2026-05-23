import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/auth.config";
import { Form } from "../../../sections/createAppointment/Form";
import { connectMongoDB } from "@/lib/mongodb";
import Lister from "@/models/lister";
import { notFound } from "next/navigation";

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

export default async function createAppointment({ params }) {
    const {username} = await params;
    const session = await getServerSession(authOptions);
    const lister = await getLister(username);
    
    if(!session)
        return <div className="heads-up">Loading...</div>;
    
    if(!lister)
        return notFound();
    
    // const thisListerId = lister._id.toString();
    const thisLister = JSON.parse(JSON.stringify(lister));

    if (session.user.id !== lister.userId.toString()) {
        return redirect("/unauthorized");
    }

    return (
        <>
            <Form thisLister={thisLister} />
        </>
    )
}