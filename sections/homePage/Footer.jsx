import Image from "next/image";
import LogoWhite from "@/assets/Logo-white.png";


export const Footer = () => {
    return (
        <footer className="bg-black text-white dark:bg-gray-600/10 py-10 text-center">
            <div className="contianer">
                <Image src={LogoWhite.src} alt="Logo"  width={20} height={20} className="mx-auto"/>
                <p className="mt-6">&copy; 2025 etchedintara, Inc. All rights reserved</p>
            </div>
        </footer>
    )
};