import { Information } from "@/app/sections/viewListerPage/Information";
import { Hero } from "@/app/sections/viewListerPage/Hero";
import { Catalog } from "@/app/sections/viewListerPage/Catalog";
import { Header } from "@/app/sections/viewListerPage/Header";
import { Reviews } from "@/app/sections/viewListerPage/Reviews";
import { Selections } from "@/app/sections/viewListerPage/Selections";


export default async function listerPage ({params}) {
  const {id} = await params;
  // console.log("id: ", id);
  return (
    <div className="bg-[#D9D9D9] pb-10">
      <Header id={id}/>
      <div className="md:container md:w-[90%] bg-white md:mt-10 md:rounded-lg pb-20">
        <Hero id={id} />
        <Information id={id} />
        <Catalog firstname={"NAME"}/>
        <Reviews />
      </div>
    </div>
  );
};