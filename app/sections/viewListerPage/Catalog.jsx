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
    // {
    //     url: postTemplate,
    // },    
    // {
    //     url: postTemplate,
    // },
    // {
    //     url: postTemplate,
    // },
    // {
    //     url: postTemplate,
    // },    
    // {
    //     url: postTemplate,
    // },
];

export const Catalog = ({firstname}) => {
    return (
        <section>
            <div className="pt-10 pb-20">
                <div className="flex flex-col gap-5 justify-center items-center">
                    <div className="section-title text-xs md:text-md xl:text-2xl">
                        {firstname}&apos;s Work
                    </div>
                    <div className="w-full md:w-fit">
                        <div className="py-10 flex flex-col md:flex-row justify-center items-center gap-1 bg-[#F3F3F3] rounded-lg px-10">
                            {posts.map(({url}, index) => (
                                <div key={index} className="w-[189px] h-[336px] hover:scale-[1.01] transition transform duration-300">
                                    <Image src={url} alt="a lister's post" layout=""/>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};