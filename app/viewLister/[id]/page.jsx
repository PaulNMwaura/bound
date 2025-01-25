import { Information } from "@/app/sections/viewListerPage/Information";
import { Hero } from "@/app/sections/viewListerPage/Hero";
import { Catalog } from "@/app/sections/viewListerPage/Catalog";
import { Header } from "@/app/sections/viewListerPage/Header";
import { Reviews } from "@/app/sections/viewListerPage/Reviews";

export default async function listerPage ({params}) {
  const {id} = await params;
  // console.log("id: ", id);
  return (
    <>
      <Header />
      <Hero id={id} />
      <Information id={id} />
      <Catalog />
      <Reviews />
    </>
  );
};