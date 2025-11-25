"use client";

import Image from "next/image";
import Link from "next/link";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useState, useEffect } from "react";
import { IoMdStar } from "react-icons/io";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { Header } from "./Header";
import { ListersFound} from "@/components/ListersFound";
import { Information } from "./Information";

const getListers = async ({ city = "", state = "", service = "", page = 1, limit = 50 }) => {
    try {
        const res = await fetch(
            `/api/listers/findListers?city=${city}&state=${state}&service=${service}&page=${page}&limit=${limit}`,
            { cache: "no-store" }
        );
        if (!res.ok) {
            throw new Error("Failed to fetch listers");
        }
        return res.json();
    } catch (error) {
        console.log("Error loading listers: ", error);
        return { listers: [], totalPages: 1 };
    }
};

export const Hero = ({session}) => {
    const searchParams = useSearchParams();
    const [filters, setFilters] = useState({
        city: searchParams.get("city") || "",
        state: searchParams.get("state") || "",
        service: searchParams.get("service") || "",
    });
    const [listers, setListers] = useState([]);
    const [totalListers, setCountListers] = useState("");
    const [isLister, setLister] = useState(false);
    const [username, setListerUsername] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const router = useRouter();

    useEffect(() => {
        const fetchListers = async () => {
            const { listers, totalPages, totalCount } = await getListers({ ...filters, page });
            setListers((prevListers) => [
                ...prevListers,
                ...listers.filter((lister) => !prevListers.some((existing) => existing._id === lister._id)),
            ]);
            setTotalPages(totalPages);
            setCountListers(totalCount);
            setLoading(false);
        };

        fetchListers();
    }, [filters, page]);

    useEffect(() => {
        setListers([]);
        setPage(1); // Reset page to 1 when filters change
    }, [filters]);

    const id = session?.user?.id || "";
    useEffect(() => {
        if (!id) return;
        const checkIfIsLister = async () => {
            try {
                const response = await fetch(`/api/listers/findByUserId?id=${id}`);
                if (!response.ok) {
                    console.log(response.status);
                    throw new Error('Lister not found');
                }
                const data = await response.json();
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

    let sessionStatus = "";

    if(!session) sessionStatus = "unauthenticated";
    if (loading && page === 1) return <div className="heads-up">Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
      <div className="min-h-screen bg-white text-black">
        <Header
          username={username}
          isLister={isLister}
          setFilters={setFilters}
          session={session}
          sessionStatus={sessionStatus}
        />
        <div>
          <section className="pt-5 pb-10">
            <div className="container pb-10 flex flex-col items-center bg-white text-black min-h-screen rounded-xl">
              {session && (
                <Information setFilters={setFilters} session={session}/>
              )}
              <div className="mt-8 flex justify-between gap-5 md:gap-0 w-full">
                <div className="pl-3 w-[50%] md:w-[30%]">
                  <ListersFound count={totalListers} />
                </div>
                <div className="font-semibold">
                  {filters.city && filters.state && (
                    <div className="hidden md:block">
                      You are searching in {filters.city}, {filters.state}.
                    </div>
                  )}
                  {filters.city && !filters.state && (
                    <div>You are searching in {filters.city}.</div>
                  )}
                  {!filters.city && filters.state && (
                    <div>You are searching in {filters.state}.</div>
                  )}
                </div>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {listers &&
                  listers.length > 0 &&
                  listers.map((lister, index) => (
                    <div key={index} className="pt-3 md:pt-3 p-3 flex flex-col">
                      {/* Card Image */}
                      <div className="flex justify-center">
                        {lister.bannerPicture ? (
                          <Image
                            src={lister.bannerPicture}
                            alt="Lister Banner Picture"
                            width={1920}
                            height={1080}
                            priority={true}
                            className="object-cover aspect-16/9 w-full h-full rounded-lg"
                          />
                        ) : (
                          <div className="aspect-16/9 w-full h-full bg-[#a2a2a2] rounded-lg" />
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
                            ) : (
                              <p className="font-semibold">Not yet rated</p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-sm opacity-60">@{lister.username}</div>
                        <div className="font-normal">{lister.city}, {lister.state}</div>
                      </div>
                      <div className="text-md">
                        <div className="font-bold">
                          Services offered by {lister.firstname}
                        </div>
                        {lister.services.map((service, jndex) => (
                          <div
                            key={jndex}
                            className="px-5 font-normal opacity-40"
                          >
                            {service.name}
                          </div>
                        ))}
                      </div>
                      <div className="pt-1 font-bold">
                        About {lister.firstname}
                        <div className="font-normal opacity-40">
                          {lister.description}
                        </div>
                      </div>

                      {/* Buttons Section */}
                      <div className="mt-auto pt-4 flex flex-row">
                        <button className="btn btn-primary">
                          <Link href={`/profile/${lister.username}`}>
                            View {lister.firstname}'s profile
                          </Link>
                        </button>
                        {/* {lister.userId !== session?.user?.id && (
                          <button
                            className="btn"
                            onClick={() =>
                              router.push(`/messages?id=${lister.userId}`)
                            }
                          >
                            Message {lister.firstname}
                          </button>
                        )} */}
                      </div>
                    </div>
                  ))}
              </div>
              {listers.length === 0 && (
                <div className="container text-md text-center font-medium min-h-screen bg-white">
                  {filters.service ? (
                    <p className="mt-8">
                      We are having trouble finding listers who specialize in{" "}
                      <strong>{filters.service}</strong> near you.
                    </p>
                  ) : (
                    <p className="mt-20">
                      Trouble finding listers. Either there are no listers in
                      this area or your spelling is incorrect. Please double
                      check your spelling.
                    </p>
                  )}
                </div>
              )}

              {page < totalPages && (
                <div className="mt-6 flex flex-col items-center">
                  <button
                    onClick={() => setPage((prev) => prev + 1)}
                    className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                  >
                    {loading ? "Loading..." : "Load More"}
                  </button>
                  <MdKeyboardArrowDown/>
                </div>
              )}

              {loading && page > 1 && (
                <div className="text-center mt-4">Loading more listers...</div>
              )}
            </div>
          </section>
        </div>
        <button 
        className="z-10 fixed bottom-10 right-3 btn btn-primary hover:cursor-pointer text-xs sm:text-[14px]"
        onClick={() => redirect("/requests?request=true")}
        >
            {session != null ? "Request Service":"Login to Request Service"}
        </button>
      </div>
    );
};