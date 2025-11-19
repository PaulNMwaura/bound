import Link from "next/link";

export const Hero = ({session}) => {
    return (
        <section>
            <div className="container h-[100vh] flex flex-col justify-center items-center -mt-14">
                <p className="tag outline-orange-500 opacity-90">The Service Marketplace</p>
                {/* <strong className="mt-2 text-lg md:text-2xl tracking-tight text-purple-400">House Your Hustle</strong> */}
                <strong className="mt-2 text-xl md:text-4xl tracking-tight">For Your Needs</strong>
                <div className="mt-3 flex flex-row items-center gap-5">
                    <div className="flex flex-col text-center">
                        {/* <Link href={session?.user?.hasAccess ? "/applyLister" : "/payment"} className="btn outline-1">Create A Lister's Account</Link> */}
                        <Link href="/applyLister" className="btn outline-1 text-sm">Create A Lister's Account</Link>
                    </div>
                    <div className="flex flex-col text-center">
                        <Link href={"/"} className="btn btn-primary-alt text-sm">Find A Lister</Link>
                    </div>
                </div>
            </div>
        </section>
    )
};