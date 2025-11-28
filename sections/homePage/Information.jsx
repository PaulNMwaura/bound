import { redirect } from "next/navigation";

export const Information = ({ services }) => {
  if (!services || services.length === 0)
    return null;

  return (
    <section className="mt-10 py-10 px-2">
      <h1 className="text-lg text-center md:text-4xl font-bold mb-6 tracking-tight">
        Our current service offerings
      </h1>

      <div
        className="
          w-full
          max-h-[500px] 
          flex
          gap-4 
          overflow-x-auto no-scrollbar 
          lg:flex-wrap md:justify-center
          lg:overflow-y-scroll
          p-2
        "
      >
        {services.map((service, index) => (
          <div
            key={index}
            className="
              relative 
              min-w-[190px] 
              md:w-64 
              h-30 
              bg-white
              dark:bg-black
              dark:outline-1
              dark:outline-white
              dark:text-white
              text-black
              rounded-xl 
              p-4 
              inset-shadow-sm
              shadow-md
              hover:scale-[1.07]
              hover:cursor-pointer
              hover:bg-blue-500
              transition 
              backdrop-blur-sm
            "
            onClick={() => redirect(`/?service=${service.name}`)}
          >
            <div className="text-lg font-semibold">
              {service.name}
            </div>

            <div className="absolute bottom-3 w-full flex justify-between items-center pr-6 text-sm opacity-70">
              <p># of listers offering this:</p>
              <span>{service.count}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-10 w-full h-fit flex flex-col lg:flex-row justify-between gap-4 dark:bg-orange-500 bg-[#98F5F9] px-4 py-10">
        <div className="w-full min-h-fit h-54 p-4 rounded-md bg-white text-black inset-shadow-sm shadow-md">
          <h1 className="mt-3 font-semibold">Have a service you want to provide?</h1>
          <p className="mt-3">Becoming a lister will allow you to be found by people looking for your skillset, and manage your clients and appointments all in one place.</p>
          <div className="w-full flex justify-end">
            <button className="mt-3 btn btn-primary" onClick={() => redirect("/applyLister")}>Become a lister</button>
          </div>
        </div>
        <div className="w-full min-h-fit h-54 p-4 rounded-md bg-black text-white">
          <h1 className="mt-3 font-semibold">Looking to get help?</h1>
          <p className="mt-3">We have listers ready to provided their services to you. Simply browse our page for a qualifying lister, and book an appointment with them. It's easy!</p>
          <div className="w-full flex justify-end">
            <button className="mt-3 btn btn-primary-opp" onClick={() => redirect("/")}>Find a lister</button>
          </div>
        </div>
        <div className="w-full min-h-fit h-54 p-4 rounded-md bg-white text-black inset-shadow-sm shadow-md">
          <h1 className="mt-3 font-semibold">Can't find what you want?</h1>
          <p className="mt-3">Posting a service request allows listers to pick up your request. </p>
          <div className="w-full flex justify-end">
            <button className="mt-11 btn btn-primary" onClick={() => redirect("/requests")}>Post a request</button>
          </div>
        </div>
      </div>
    </section>
  );
};
