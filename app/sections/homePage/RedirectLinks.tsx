import Link from "next/link";

const linkCatergories = [
    {
      title: "Browse Categories",
      links: [
        "Babers",
        "Hairstylists",
        "Nail artists",
        "tattoo artists",
        "Make-up artists",
      ],
    },
    {
      title: "Get Started",
      links: [
        "Browse for professional",
        "Become a lister",
        "Tips and Guides",
      ],
    },
  ];
  
  export const RedirectLinks = () => {
    return (
      <section>
        <div className="container">
          <div className="flex flex-col gap-6 items-center mt-10 md:flex-row md:justify-center md:items-start">
            {linkCatergories.map(({title, links}, index) => (
              <div key={index} className="p-10">
                <h3 className="text-2xl font-bold">{title}</h3>
                <ul className="flex flex-col gap-3 mt-8">
                  {links.map((link, jndex) => (
                    <Link href="#" key={jndex} className="text-lg flex items-center gap-4">{link}</Link>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };
  