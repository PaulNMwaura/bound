import Pricing from "@/components/Pricing";

export const Hero = ({session}) => {
    return (
        <main>
            <div className="w-full flex md:p-6">
                <div className="w-full md:w-[50%] px-7 py-14 flex flex-col justify-center mr-auto bg-black text-white dark:bg-white dark:text-black md:rounded-lg">
                    <div className="text-end font-bold">
                        <h2 className="text-xl section-title">
                            Become a Lister and Grow Your Business <br />
                        </h2>
                        <p className="text-lg text-orange-500">What is a lister?</p>
                    </div>
                    <h3 className="mt-4 text-justify">
                    Joining our platform as a lister allows you to establish your own dedicated space online to promote, manage, and grow your services. 
                    We provide the tools and support to help you build a strong online presence for your hustle. <br />

                    Whether you're a babysitter, dog sitter, lawn care provider, hair braider or stylist, car detailer, house cleaner, interior designer, 
                    or offer other services that align with our terms and conditions — our platform is designed to help you succeed.
                    </h3>
                </div>
            </div>
            <div className="w-full flex md:p-6">
                <div className="w-full md:w-[50%] px-7 py-14 flex flex-col justify-center ml-auto bg-black text-white dark:bg-white dark:text-black md:rounded-lg">
                    <h2 className="mt-4 text-start text-xl font-bold section-title">
                        Why you should become a lister <br />
                    </h2>
                    <strong className="mt-3">Effortlessly Establish Your Online Presence</strong>
                    <li className="text-justify">
                        <a>
                            Our platform makes it easy to launch your professional profile — simply fill in your details, describe your services, and set your availability to start accepting requests.
                            No need to spend hours designing a website or fine-tuning layouts — we handle the technical side so you can focus on what you do best: growing your business.
                        </a>
                    </li>
                    <strong className="mt-3">Save Time With Streamlined Communications</strong>
                    <li className="text-justify">
                        <a>
                            Your time is valuable. With a complete lister profile, clients can access all the essential information about your services upfront — reducing the need for unnecessary phone calls.
                            And if they still have questions, our built-in messaging system makes it easy to communicate directly, without the hassle of scheduling calls or switching to a separate app.
                        </a>
                    </li>
                    <strong className="mt-3">Manage Your Time</strong>
                    <li className="text-justify">
                        <a>
                        Clients can view your real-time availability, which you control and can update at any time.
                        When a service request is submitted, you can easily manage and respond to it directly from your lister dashboard — giving you full control over your schedule and bookings.
                        </a>
                    </li>
                </div>
            </div>
            <div className="pt-8 w-full aspect-video/2 flex flex-col items-center">
                <div className="border-2 md:rounded-lg p-6">
                    <h1 className="font-bold text-lg text-center">Still unsure?</h1>
                    <h1 className="pt-3 w-fit md:w-[600px] text-justify">
                        If you’re unsure whether our platform is the right fit for you, stay tuned — we’ll soon be releasing a showcase video highlighting the features, benefits, and real possibilities of becoming a lister.
                        Follow us on social media to be the first to know when the video goes live. You can find our social links at the bottom of this page.
                    </h1>
                    <h1 className="font-bold pt-5 text-xl text-center"> Otherwise, get started by purchasing your access below</h1>
                </div>
            </div>
            <Pricing session={session}/>
        </main>
    )
}