// Landing Page
import SEO from "../components/SEO";

export default function Home() {
  return (
    <>
      {/* this needs to be adjusted depending on the page. */}
      <SEO 
        title="Freelance Services Platform | EtchedInTara (EIT)" 
        keywords="freelance services, online presence, freelance platform, service freelancers, side hustle, freelancing, EtchedInTara, etched in tara, etchedintara, ETCHEDINTARA, eit, EIT, hustle, side hustle business, market your hustle, freelancing platform, freelance gigs, online freelancing"
        description="EtchedInTara (EIT) is a dynamic platform for service freelancers looking to create and grow their online presence. Whether you're building a side hustle or a full-time career, EIT helps freelancers market their services effectively and gain visibility on the web. Helping you do what you do, but do it precisely." 
        url="https://www.etchedintara.com" 
        type="website" 
      />


      <div className="w-screen h-screen flex flex-col justify-center items-center">
        <strong className="text-lg">This site is under development</strong>
        <p>come back later for updates</p>
      </div>
    </>
  );
}
