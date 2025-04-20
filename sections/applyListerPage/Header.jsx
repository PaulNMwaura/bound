import { FaArrowRight } from "react-icons/fa";

export const Header = () => {
    return (
        <header className="container bg-white text-black md:rounded-b-lg py-2">
            {/* <div className="flex md:hidden flex-row justify-center items-center gap-1 py-1 text-xs text-center">
                <p className="opacity-50">Why are we asking for this info?</p>
                <button className="flex flex-row items-center gap-[1px]">
                    <p className="font-semibold">Click to read</p>
                    <div className="mt-[2px]">
                        <FaArrowRight size={10}/>
                    </div>
                </button>
            </div> */}
            <div className="px-4 flex justify-between items-center text-sm">
                <p>LOGO</p>
                <a href="/" className="btn">Cancel</a>
            </div>
        </header>
    );
};