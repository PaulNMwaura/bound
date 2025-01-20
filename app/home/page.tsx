import Header from "@/app/sections/homePage/Header";
import Hero from "@/app/sections/homePage/Hero";
import Information from "@/app/sections/homePage/Information";
import ProductShowcase from "@/app/sections/homePage/ProductShowcase";
import { RedirectLinks } from "@/app/sections/homePage/RedirectLinks";
import { CallToAction } from "@/app/sections/homePage/CallToAction";
import { Footer } from "@/app/sections/homePage/Footer";

export default function Home(){
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