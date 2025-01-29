import { IoSearch, IoHomeOutline, IoSettingsOutline  } from "react-icons/io5";
import { AiOutlineMessage } from "react-icons/ai";
import { MdOutlineManageAccounts } from "react-icons/md";
import Image from "next/image";

export const Navbar = () => {
    return (
        <section className="">
            <div className="pl-4 h-[100px] bg-[#740A90] flex items-center justify-start gap-2">
                {/* <Image src={Logo} width={24} height={24} /> */}
                <div className="w-8 h-8 rounded-md shadow-sm bg-yellow-400 flex justify-center items-center">
                    {/* firstname[0].toUpper */}
                    Y
                </div>
                <a>Your Name</a>
            </div>
            <div className="py-4 pl-4 bg-[#A63EC1] text-xl">
                <ul className="flex flex-col">
                    <div className="py-3 flex items-center gap-2 hover:cursor-pointer hover:bg-gradient-to-r from-[#EAE8EB]/30 to-[#A63EC1]">
                        <IoHomeOutline />
                        <li>
                            <a>home</a>
                        </li>
                    </div>
                    <div className="py-3 flex items-center gap-2 hover:cursor-pointer hover:bg-gradient-to-r from-[#EAE8EB]/30 to-[#A63EC1]">
                        <IoSearch />
                        <li>
                            <a>browse</a>
                        </li>
                    </div>
                    <div className="py-3 flex items-center gap-2 hover:cursor-pointer hover:bg-gradient-to-r from-[#EAE8EB]/30 to-[#A63EC1]">
                        <AiOutlineMessage />
                        <li>
                            <a>messages</a>
                        </li>
                    </div>
                    <div className="py-3 flex items-center gap-2 hover:cursor-pointer hover:bg-gradient-to-r from-[#EAE8EB]/30 to-[#A63EC1]">
                        <IoSettingsOutline />
                        <li>
                            <a>view profile</a>
                        </li>
                    </div>
                </ul>
            </div>
            <div className="py-5 pl-4 bg-[#881ba3] text-xl">
                <ul className=" flex flex-col">
                    <div className="py-3 flex items-center gap-2 hover:cursor-pointer hover:bg-gradient-to-r from-[#EAE8EB]/30 to-[#A63EC1]">
                        <MdOutlineManageAccounts size={24} />
                        <li>
                            <a>profile settings</a>
                        </li>
                    </div>  
                </ul>
            </div>
        </section>
    );
};