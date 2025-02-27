const reviews = [
    {
        firstname: "Taylor",
        lastname: "Tanaka",
        comment: "Amy is one of the most efficient professionals I've had when it comes to styling my hair!",
    },
    {
        firstname: "Victoria",
        lastname: "Travolt",
        comment: "Awesome service!",
    },
    {
        firstname: "Mikayla",
        lastname: "Ponson",
        comment: "Hands down, best stylist!",
    },
];

export const Reviews = () => {
    return (
        <section className="py-3">
            <div className="container">
                <div className="flex flex-col justify-center items-center gap-6 lg:gap-10">
                    {reviews.map((review, index) => (
                        <div key={index} className="w-full lg:w-3/4 bg-[#ABEEFF] rounded-lg p-5 shadow-md">
                            <div className="flex flex-row gap-4 items-center">
                                {/* Profile Picture */}
                                <div className="w-16">
                                    <div className="w-16 h-16 rounded-full bg-[#D9D9D9]"></div>
                                </div>
                                <div className="flex flex-col justify-start">
                                    <div className="text-md md:text-lg lg:text-xl font-semibold">{review.firstname}</div>
                                    <div className="text-xs md:text-md lg:text-lg text-gray-600">{review.comment}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
