"use client";

import { Lister } from "@/app/listersTempData";
import Logo from "@/app/assets/logo-holder.png";
import Image from "next/image";


export const Hero = ({id}) => {
  const thisLister = Lister[id];
    return (
      <section className="pb-10">
        <div className="container">
          <div className="pt-10 text-sm md:text-lg">
            <div className="flex gap-4">
              <div>
                <Image src={Logo} alt="Profile picture goes here" width={100}/>
              </div>
              <div className="max-w-[600px]">
                <div className="flex justify-between font-semibold">
                  <a>{thisLister.rating}</a>
                  <a>{thisLister.location}</a>
                </div>
                <div>
                  {thisLister.description}
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <a className="font-semibold">{thisLister.firstname} {thisLister.lastname}</a>
              <a className="font-light">English</a>
            </div>
          </div>
        </div>
      </section>
    );
};