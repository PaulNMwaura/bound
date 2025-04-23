"use client";

import Image from "next/image";
import Link from "next/link";
import { IoMdStar } from "react-icons/io";
import { useState, useEffect } from "react";
import { Header } from "./Header";
import { redirect, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Information } from "./Information";
import { ListersFound } from "@/components/ListersFound";

const getListers = async ({ city = "", state = "", service = "" }) => {
    try {
        const res = await fetch(
            `/api/listers/findListers?city=${city}&state=${state}&service=${service}`,
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
    const [username, setListerUsername] = useState(null);
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
            const response = await fetch(`/api/listers/findByUserId?id=${id}`);    
            if (!response.ok) {
                console.log(response.status);
                throw new Error('Lister not found');
            }
            const data = await response.json();
            // console.log("data: ", data.lister);
            setListerUsername(data.lister.username);
            setLister(true);
        } catch (error) {
            return;
        } finally {
            setLoading(false);
        }
    };

    checkIfIsLister();
    }, [id]);

    if (loading) return <div className="heads-up">Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="min-h-screen bg-[#D9D9D9] text-black ">
            <Header username={username} isLister={isLister} setFilters={setFilters}/>
            <div>
                <section className="pt-5 pb-10">
                    <div className="container flex flex-col items-center bg-white text-black min-h-screen rounded-xl">
                        <Information setFilters={setFilters} />
                        <div className="mt-8 flex justify-between gap-5 md:gap-0 w-full">
                            <div className="pl-3 w-full md:w-[30%]">
                                <ListersFound count={listers.length}/>
                            </div>
                            <div className="font-semibold">
                                {filters.city && filters.state && (
                                    <div className="hidden md:block">
                                        You are searching in {filters.city}, {filters.state}.
                                    </div>
                                )}
                                {filters.city && !filters.state && (
                                    <div>
                                        You are searching in {filters.city}.
                                    </div>
                                )}
                                {!filters.city && filters.state && (
                                    <div>
                                        You are searching in {filters.state}.
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {listers && listers.length > 0 && (
                                listers.map((lister, index) => (
                                <div key={index} className="pt-3 md:pt-3 p-3 flex flex-col">
                                    
                                    {/* Card Image */}
                                    <div className="flex justify-center">
                                        {lister.bannerPicture ? (
                                            <Image src={lister.bannerPicture} alt="Lister Banner Picture" width={1920} height={1080} priority={true} className="object-cover w-[368px] h-[207px] rounded-lg" />
                                        ):(
                                            <div className="w-[368px] h-[207px] bg-[#a2a2a2] rounded-lg">
                                            </div>
                                        )}
                                    </div>

                                    {/* Card Content */}
                                    <div className="pt-1 flex justify-between">
                                        <div className="text-lg text-black font-bold tracking-tight">
                                            {lister.firstname} {lister.lastname}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <div>
                                                <IoMdStar />
                                            </div>
                                            <div>
                                                {lister.rating ? (
                                                    <p className="font-semibold">{lister.rating}/5</p>
                                                ):(
                                                <p className="font-semibold">No yet rated</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-sm">{lister.location}</div>
                                    <div className="text-md">
                                        <div className="font-bold">
                                            Services offered by {lister.firstname}
                                        </div>
                                        {lister.services.map((service, jndex) => (
                                            <div key={jndex} className="px-5 font-normal opacity-40">{service.name}</div>
                                        ))}
                                    </div>
                                    <div className="pt-1 font-bold">
                                        About {lister.firstname}
                                        <div className="font-normal opacity-40">{lister.description}</div>
                                    </div>

                                    {/* Buttons Section */}
                                    <div className="mt-auto pt-4 flex flex-row">
                                        <button className="btn btn-primary">
                                            <Link href={`/profile/${lister.username}`}>
                                                View {lister.firstname}'s page
                                            </Link>
                                        </button>
                                        {lister.userId != session.user.id && (
                                            <button className="btn" onClick={() => redirect(`/messages?id=${lister.userId}`)}>
                                                Message {lister.firstname}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )))}
                        </div>
                        {listers.length == 0 && (
                            <div className="container text-md text-center font-medium min-h-screen bg-white">
                                {filters.service ? (
                                    <p className="mt-8">We are having trouble finding listers who specialize in <strong>{filters.service}</strong> near you.</p>
                                    ):(
                                        <p className="mt-20">
                                            Trouble finding listers. Either there are no listers in this area 
                                            or your spelling is incorrect. Please double check your spelling.
                                        </p>
                                    )
                                }
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};