"use client";

// import { Lister }from "@/app/listersTempData";
import Image from "next/image";
import Logo from "@/app/assets/logo-holder.png";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Header } from "./Header";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { view } from "framer-motion";

const getListers = async ({ city = "", state = "", service = "" }) => {
    try {
        const res = await fetch(
            `/api/findListers?city=${city}&state=${state}&service=${service}`,
            { cache: "no-store" }
        );

        if (!res.ok) {
            throw new Error("Failed to fetch listers");
        }

        return res.json();
    } catch (error) {
        console.log("Error loading listers: ", error);
        return { listers: [] };
    }
};

export const Hero = () => {
    const searchParams = useSearchParams();
    const [filters, setFilters] = useState({
        city: searchParams.get("city") || "",
        state: searchParams.get("state") || "",
        service: searchParams.get("service") || "", 
    });
    const [listers, setListers] = useState([]);
    const [isLister, setLister] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { data: session } = useSession();
    
    useEffect(() => {
        const fetchListers = async () => {
            const { listers } = await getListers(filters);
            setListers(listers);
        };
        fetchListers();
    }, [filters]); // Re-run effect when filters change

    const id = session?.user?.id || "";
    useEffect(() => {
        if(!id) return;
        // Fetch lister data when component mounts
        const checkIfIsLister = async () => {
        try {
            console.log("id: ", id);
            const response = await fetch(`/api/findByUserId?id=${id}`);
        if (!response.ok) {
            console.log(response.status);
            throw new Error('Lister not found');
        }
        // const data = await response.json();
        // console.log("data: ", data.lister);
        setLister(true);
        } catch (error) {
            return;
        } finally {
        setLoading(false);
        }
    };

    checkIfIsLister();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
// /    if (!isLister) return <div>No lister found</div>;

    // if(isLister)
    //     console.log("The viewer is a lister");

    // console.log("lister: ", viewer.userId,"\nViewer: ", id);
    // const isLister = viewer.id;
    // if(isLister)
    //     console.log("session: ", session.user.id, "\nlister: ", viewer.id);

    return (
        <>
            <Header id={id} isLister={isLister} setFilters={setFilters}/>
            <main className="pt-10">
                <div className="container max-w-[90%] ">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {listers && listers.length > 0 ? (
                            listers.map((lister, index) => (
                            <div key={index} className="pt-3 md:pt-3 p-3 flex flex-col bg-[#98F5F9]/20 rounded shadow">
                                {/* Card Image */}
                                <div className="flex justify-center">
                                    <Image src={lister.picture || Logo} alt="Profile Picture" width={208} height={208} className="object-fit max-w-62 max-h-52 rounded-lg" />
                                </div>

                                {/* Card Content */}
                                <div className="pt-2 flex justify-between">
                                    <div className="flex flex-row gap-2 text-xl text-black font-bold tracking-tight">
                                        <div>{lister.firstname}</div>
                                        <div>{lister.lastname}</div>
                                    </div>
                                    <div>{"0"}/5</div>
                                </div>
                                <div className="text-sm">{lister.location}</div>
                                <div className="pt-2 text-md">
                                    <div className="font-semibold">
                                        Services offered by {lister.firstname}
                                    </div>
                                    {lister.services.map((service, jndex) => (
                                        <div key={jndex} className="px-5">{service.name}</div>
                                    ))}
                                </div>
                                <div className="pt-2 font-semibold">
                                    {lister.firstname} Specializes in:
                                    <div className="font-normal">{lister.description}</div>
                                </div>
                                <div className="pt-2 font-semibold">
                                    Pricing Info:
                                    <div className="font-normal">{"EMPTY"}</div>
                                </div>

                                {/* Buttons Section */}
                                <div className="mt-auto pt-4 flex flex-row">
                                    <button className="btn text-purple-500">
                                        Contact
                                    </button>
                                    <button className="btn btn-primary">
                                        <Link href={`/viewLister/${lister._id}`}>
                                            View {lister.firstname}'s page
                                        </Link>
                                    </button>
                                </div>
                            </div>
                        ))
                        ) : (
                        <div className="w-full md:w-screen text-center text-xl">
                            {
                                filters.service? (
                                    <p className="md:mr-48 text-center">We are having trouble finding listers who specialize in <strong>{filters.service}</strong> near you.</p>
                                ):(
                                    <p className="md:mr-48">
                                        Trouble finding listers.<br/> 
                                        Make sure your spelling is correct
                                    </p>
                                )
                            }
                        </div>
                        )}
                    </div>
                </div>
            </main>
        </>
    );
};
