"use client";
import SEO from "../components/SEO";
import { motion } from "framer-motion";
import { Header } from "@/sections/homePage/Header";
import { Hero } from "@/sections/homePage/Hero";
import { Footer } from "@/sections/homePage/Footer";
import { useSession } from "next-auth/react";

export default function Home() {
  const {data: session, status} = useSession();

  if(status == "loading")
    return <div>Loading...</div>
  // CREATE PAGE THAT REGULAR USERS CAN POST A REQUEST!!! then listers can browse the page and claim posted requests!! -> Idead addition to website
  return (
    <>
      {/* this needs to be adjusted depending on the page. */}
      <SEO 
        title="Freelance Services Platform | EtchedInTara (EIT)" 
        keywords="freelance services, online presence, freelance platform, service freelancers, side hustle, freelancing, EtchedInTara, etched in tara, etchedintara, ETCHEDINTARA, eit, EIT, hustle, side hustle business, market your hustle, freelancing platform, freelance gigs, online freelancing"
        description="EtchedInTara (EIT) is a dynamic platform for service freelancers looking to create and grow their online presence. Whether you're building a side hustle or a full-time career, EIT helps freelancers market their services effectively and gain visibility on the web. Helping you do what you do, but do it precisely." 
        url="https://www.etchedintara.com" 
        type="website" 
      />

      <motion.div
        className="fixed md:top-[-500px] left-1/2 transform -translate-x-1/2 md:w-[900px] md:h-[600px] bg-purple-500 rounded-full blur-3xl opacity-70 dark:opacity-20 z-0"
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

      <div className="z-10">
        <Header session={session}/>
        <Hero />
        <Footer />
      </div>
    </>
  );
}
