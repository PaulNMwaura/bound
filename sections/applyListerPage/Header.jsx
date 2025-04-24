import LogoBlack from "@/assets/Logo-black.png";
import Image from "next/image";

export const Header = () => {
    return (
        <header className="container bg-white text-black md:rounded-b-lg py-2">
            <div className="px-4 flex justify-between items-center text-sm">
                <div>
                    <Image src={LogoBlack.src} alt="Logo"  width={20} height={20} />
                </div>
                <a href="/" className="btn">Cancel</a>
            </div>
        </header>
    );
};