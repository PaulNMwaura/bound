import Image from "next/image";
import postTemplate from "@/app/assets/hair-pictures/postTemplate.jpg";

const posts = [
    {
        url: postTemplate,
    },
    {
        url: postTemplate,
    },
    {
        url: postTemplate,
    },    
    {
        url: postTemplate,
    },    
    {
        url: postTemplate,
    },
    {
        url: postTemplate,
    },
    {
        url: postTemplate,
    },    
    {
        url: postTemplate,
    },
];

export const Catalog = () => {
    return (
        <section>
            <div className="container pt-10 pb-20">
                <div className="flex flex-col">
                    <div className="section-title">
                        My Work
                    </div>
                    <div className="pt-10 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-1">
                        {posts.map(({url}, index) => (
                            <div key={index} className="hover:scale-[1.01] transition transform duration-300">
                                <Image src={url} alt="a lister's post" layout=""/>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};