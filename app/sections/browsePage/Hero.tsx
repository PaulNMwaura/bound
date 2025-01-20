import { Lister }from "@/app/listersTempData";
import Image from "next/image";
import Logo from "@/app/assets/logo-holder.png";
import Link from "next/link";

export const Hero = () => {
    return (
        <section className="pt-10">
            <div className="container max-w-[90%]">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Lister && Lister.length > 0 ?(
                        Lister.map(({id, picture, firstname, lastname, location, services, rating, description}) => (
                        <div key={id} className="pt-3 md:pt-3 p-3 flex flex-col bg-[#98F5F9]/20 rounded shadow">
                            {/* Card Image */}
                            <div className="flex justify-center rounded-lg bg-red-300">
                                <Image src={Logo} alt="Profile Picture" className="w-52 h-52" />
                            </div>

                            {/* Card Content */}
                            <div className="pt-2 flex justify-between">
                                <div className="flex flex-row gap-2 text-xl text-black font-bold tracking-tight">
                                    <div>{firstname}</div>
                                    <div>{lastname}</div>
                                </div>
                                <div>{rating}/5</div>
                            </div>
                            <div className="text-sm">{location}</div>
                            <div className="pt-2 text-md">
                                <div className="font-semibold">
                                    Services offered by {firstname}
                                </div>
                                {services.map((service, index) => (
                                    <div key={index} className="px-5">{service.name}</div>

                                ))}
                            </div>
                            <div className="pt-2 font-semibold">
                                {firstname} Specializes in:
                                <div className="font-normal">{description}</div>
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
                                    <Link href={`/viewLister/${id}`}>
                                        View {firstname}'s page
                                    </Link>
                                </button>
                            </div>
                        </div>
                    ))
                    ) : (
                        <p className="text-center">No listers in this area.</p>
                    )}
                </div>
            </div>
        </section>
    );
};
