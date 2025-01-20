"use client";

import { FaArrowRight } from "react-icons/fa";
import Scissors from "@/app/assets/ui-pictures/scissors.png";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

export default function Hero() {
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({
      target: heroRef,
      offset: ["start end", "end start"],
    });
  
    const translateUp = useTransform(scrollYProgress, [0,1], [-150, 150]);
  
    return (
      <section ref={heroRef} className="pt-8 pb-20 md:pt-5 md:pb-10 bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,#98F5F9,#FFFFFF_100%)] overflow-x-clip ">
        <div className="container">
          <div className="md:flex items-center">
            <div className="md:w-[478px]">
              <div className="tag">Version Beta</div>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tighter bg-gradient-to-b from-purple-600 to-orange-500 text-transparent bg-clip-text mt-6">
                FIND A PROFESSIONAL NEAR YOU
              </h1>
              <p className="text-xl text-[#010d3E] tracking-tight mt-6">
                Connect with trusted freelancers in hairstyling, haircuts, nail
                art, tattoos, and more. Book with a proffesional near you today!
              </p>
              <div className="flex gap-1 items-center mt-[30px]">
                <Link href={'/browse'} className="btn btn-primary">Start your search</Link>
                <button className="btn btn-text gap-1">
                  <span>Learn more</span>
                  <FaArrowRight className="h-3 w-3 mt-[2px]" />
                </button>
              </div>
            </div>
            <div className="mt-20 md:mt-40 md:h-[300px] md:flex-1 -rotate-90 relative">
              <motion.img
                src={Scissors.src}
                alt="Image of a gold pair of scissors"
                className="md:absolute md:h-full md:w-auto md:max-w-none md:top-20 lg:left-32"
                animate={{
                  translateX: [-20, 20],
                }}
                transition={{
                  repeat: Infinity,
                  repeatType: 'mirror',
                  duration: 5,
                  ease: 'easeInOut',
                }}
              />
            </div>
          </div>
        </div>
      </section>
    );
  };