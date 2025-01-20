"use client";

import Calendar from "@/app/components/Calendar";
import { Lister } from "@/app/listersTempData";

export const Information = ({id}) => {
    const thisLister = Lister[id];
    return (
      <section>
        <div className="container bg-[#98F5F9]/30 rounded-xl pb-20">
            <div className="lg:flex lg:flex-row lg:justify-between">
                {/* Services offered by lister section */}
                <div className="lg:w-[35%]">
                    <div className="section-title text-sm text-start pb-3 pt-5 md:text-2xl">Services Offered</div>
                    {thisLister.services.map((service, index) => (
                        <div key={index} className="text-sm md:text-lg">
                        <div className="section-description flex justify-between">
                            <ul>{service.name}</ul>
                            {service.price && (
                            <ul className="font-semibold">{service.price}</ul>
                            )}
                        </div>
                        {/* question mark because they may not exists */}
                        {service.subcategories?.map((subService, jndex) => (
                            <div
                            key={jndex}
                            className="pl-8 flex flex-row justify-between font-light"
                            >
                            <ul>{subService.name}</ul>
                            <ul className="font-semibold">{subService.price}</ul>
                            </div>
                        ))}
                        </div>
                    ))}
                </div>

                {/* Availability section */}
                <div className="lg:flex-col lg:justify-center">
                    <div className="pt-5 flex flex-col items-center">
                        <h1 className="section-title text-2xl md:text-3xl">{thisLister.firstname}'s Availability</h1>
                        <div className="pt-6">
                            <Calendar unavailableDays={thisLister.unavailableDays}/>
                        </div>
                    </div>
                    <div className="pt-3 flex flex-row gap-2 place-content-center">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded bg-red-600 overflow-y-clip overflow-x-clip">
                            <div className="w-8 h-12 rounded bg-purple-600 rotate-45 my-[15%] mx-[32%]"></div>
                            </div>
                            <a> = Unavailable</a>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded bg-orange-500 "></div>
                            <a> = Available</a>
                        </div>
                    </div>
                    <div className="pt-5 flex justify-center md:gap-20 text-xs md:text-lg">
                        <button className="btn btn-primary">Request An Appointment</button>
                        <button className="btn">contact</button>
                    </div>
                </div>
            </div>
        </div>
      </section>
    );
};