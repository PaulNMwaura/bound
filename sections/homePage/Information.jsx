import { redirect } from "next/navigation";

export const Information = ({ services }) => {
  if (!services || services.length === 0)
    return null;

  return (
    <section className="mt-10 py-10 px-2">
      <h1 className="text-lg text-center md:text-4xl font-bold mb-6">
        We have offerings for
      </h1>

      <div
        className="
          w-full
          max-h-[500px] 
          flex
          gap-4 
          overflow-x-auto no-scrollbar 
          md:flex-wrap md:justify-center
          md:overflow-y-scroll
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
              text-black
              rounded-xl 
              p-4 
              inset-shadow-sm
              hover:scale-[1.07]
              hover:cursor-pointer
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
    </section>
  );
};
