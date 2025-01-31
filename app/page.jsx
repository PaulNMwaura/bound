// // import LoginForm from "./sections/loginPage/LoginForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import Header from "@/app/sections/homePage/Header";
import Hero from "@/app/sections/homePage/Hero";
import Information from "@/app/sections/homePage/Information";
import ProductShowcase from "@/app/sections/homePage/ProductShowcase";
import { RedirectLinks } from "@/app/sections/homePage/RedirectLinks";
import { CallToAction } from "@/app/sections/homePage/CallToAction";
import { Footer } from "@/app/sections/homePage/Footer";

export default async function Home(){
  // if the user is already signed in, they shouldn't be accessing the login page
  //__________________________________________________
  // const session = await getServerSession(authOptions);
  
  // if (session) redirect("/browse");
  return (
    <>
        <Header />
        <Hero />
        <div className="lg:flex justify-center items-center">
            <ProductShowcase />
            <Information />
        </div>
        <RedirectLinks />
        <CallToAction />
        <Footer />
    </>
);
};
