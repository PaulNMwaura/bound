import Link from "next/link";

export const CallToAction = () => {
  return (
    <section className="py-24">
      <div className="container">
        <div className="section-heading">
          <h2 className="section-title">Become a lister</h2>
          <p className="section-description mt-5">
            Reach more clients, manage your bookings effortlessly, 
            and showcase your skills - all in one place
          </p>   
        </div> 
        <div className="flex mt-10 justify-center">
          <Link href={"/applyLister"} className="btn btn-primary">Create your account</Link>
        </div> 
      </div>
    </section>
  );
};