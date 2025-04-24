import Link from "next/link";

export const Hero = () => {
    return (
        <section>
            <div className="container h-[100vh] flex flex-col justify-center items-center -mt-14">
                <p className="tag outline-orange-500 opacity-90">The Service Marketplace</p>
                <strong className="mt-2 text-lg md:text-2xl tracking-tight text-purple-400">House Your Hustle</strong>
                <strong className="text-xl md:text-3xl tracking-tight">And Let Your Customers Find You</strong>
                <div className="mt-5 flex flex-row items-center gap-5">
                    <div className="flex flex-col text-center">
                        <Link href={"applyLister"} className="btn outline-1">Create A Lister's Account</Link>
                    </div>
                    <div className="flex flex-col text-center">
                        <Link href={"browse"} className="btn btn-primary-alt">Find A Lister</Link>
                    </div>
                </div>
            </div>
        </section>
    )
};