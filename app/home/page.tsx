"use client";
import SEO from "@/components/SEO";
import { motion } from "framer-motion";
import { Header } from "@/sections/homePage/Header";
import { Hero } from "@/sections/homePage/Hero";
import { Footer } from "@/sections/homePage/Footer";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Information } from "@/sections/homePage/Information";

export default function Home() {
  const {data: session, status} = useSession();
  const [listedServices, setListedServices] = useState([]);
  
  // useEffect(() => {
  //   async function fetchServices() {
  //     try {
  //       const res = await fetch("/api/listers/findServices");
  //       const data = await res.json();
  //       setListedServices(data.services);
  //     } catch (err) {
  //       console.error("Failed to fetch services:", err);
  //     }
  //   }

  //   fetchServices();
  // }, []);

  if (status === "loading")
    return <div className="heads-up">Loading...</div>;

  // CREATE PAGE THAT REGULAR USERS CAN POST A REQUEST!!! then listers can browse the page and claim posted requests!! -> Ideal addition to website
  return (
    <>
      {/* this needs to be adjusted depending on the page. */}
      <SEO 
        title="Service Marketplace | etchedintara (EIT)" 
        keywords="freelance services, marketplace, service marketplace, online presence, freelance platform, service freelancers, side hustle, freelancing, EtchedInTara, etched, etched in tara, etchedintara, ETCHEDINTARA, eit, EIT, hustle, side hustle business, market your hustle, freelancing platform, freelance gigs, online freelancing"
        description="etchedintara (EIT) is a dynamic platform for service freelancers looking to create and grow their online presence. Whether you're building a side hustle or a full-time career, EIT helps freelancers market their services effectively and gain visibility on the web. Helping you do what you do, but do it precisely." 
        url="https://www.etchedintara.com" 
        type="website" 
      />

      <motion.div
        className="fixed md:top-[-500px] left-1/2 transform -translate-x-1/2 md:w-[900px] md:h-[600px] dark:bg-blue-500 bg-orange-500 rounded-full blur-3xl opacity-70 dark:opacity-20 z-0"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.1, 0.2, 0.1],
          boxShadow: [
            "0 0 0px rgba(168, 85, 247, 0.4)",
            "0 0 80px rgba(168, 85, 247, 0.5)",
            "0 0 0px rgba(168, 85, 247, 0.4)"
          ]
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          boxShadow: "0 0 40px rgba(168, 85, 247, 0.5)", // fallback static glow
        }}
      />

     <div className="z-10 min-h-screen h-fit flex flex-col">
  
      <div className="flex-grow">
        <Header session={session} />
        <Hero session={session} />
        {listedServices.length ? (
          <Information services={listedServices} />
        ):(
          <div className="pt-20 aspect-video">
            <div className="w-full flex justify-center aspect-video">
              <iframe
                className="w-full h-full md:w-[580px] md:h-[415px]"
                src="https://www.youtube.com/embed/rmjgl45dmow?si=sDPAIRGHxengWH2C"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>

    </>
  );
}
