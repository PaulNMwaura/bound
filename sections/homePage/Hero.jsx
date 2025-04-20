import Link from "next/link";

export const Hero = () => {
    return (
        <section>
            <div className="container h-[100vh] flex flex-col justify-center items-center -mt-10">
                <p className="tag outline-orange-500 mb-3">make your side gig more fluid</p>
                <strong className="text-lg md:text-2xl tracking-tight text-purple-400">We Make It Easier</strong>
                <strong className="text-xl md:text-3xl tracking-tight">For Your Customers To Find You</strong>
                <div className="mt-3 flex flex-row items-center gap-5">
                    <div className="flex flex-col text-center">
                        <p>Become A Lister</p>
                        <Link href={"applyLister"} className="btn outline-1">Apply</Link>
                    </div>
                    <div className="flex flex-col text-center">
                        <p>Get Serviced</p>
                        <Link href={"browse"} className="btn btn-primary-alt">Find A Lister</Link>
                    </div>
                </div>
            </div>
        </section>
    )
};