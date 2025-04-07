import Logo from "@/app/assets/logo-holder.png";
import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="bg-black text-[#BCBCBC] text-sm py-10 text-center">
      <div className="container">
        <Image src={Logo} height={40} alt="Website Logo" className="inline-flex"/>
        <nav className="flex flex-col md:flex-row md:justify-center gap-3 mt-6">
          <a href="#">About</a>
          <a href="#">Features</a>
          <a href="#">Customers</a>
          <a href="#">Help</a>
          <a href="#">Careers</a>
          <a href="#">Terms of Agreement</a>
        </nav>
        <p className="mt-5">&copy; 2024 Bounded, Inc. All rights reserved</p>
      </div>
    </footer>
  );
};
