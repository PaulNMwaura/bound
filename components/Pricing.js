'use client';

import React, { useState } from 'react';

// Stripe Plans >> fill in your own priceId & link
export const plans = [
    {
        link: process.env.NODE_ENV === 'development' ? '' : 'https://buy.stripe.com/00gdSk5xHgad5uo9AA',
        priceId: process.env.NODE_ENV === 'development' ? '' : 'prod_SDOSGElsmTnXkd',
        price: 49.99,
        duration: 'Lifetime'
    },
    // {
    //     link: process.env.NODE_ENV === 'development' ? '********' : '',
    //     priceId: process.env.NODE_ENV === 'development' ? '********' : '',

    //     price: 99,
    //     duration: '/year'
    // }
];

const Pricing = ({session}) => {
    const [plan, setPlan] = useState(plans[0]);

    return (
        <>
            <section id="pricing">
                <div className="py-24 px-8 max-w-5xl mx-auto">
                    <div className="flex flex-col text-center w-full mb-10">
                        {/* <p className="mb-5">Hello {session?.user?.firstname}.To get started, first make your access purchase.</p> */}
                        <h2 className="font-bold text-3xl lg:text-5xl tracking-tight">
                            Lister Account Access
                        </h2>
                    </div>

                    <div className="relative flex justify-center flex-col lg:flex-row items-center lg:items-stretch gap-8">
                        <div className="w-full max-w-sm">
                            <div className="relative flex flex-col h-full gap-5 lg:gap-8 z-10 bg-base-100 p-8 rounded-xl bg-black text-white dark:bg-white dark:text-black">

                                <div className="flex gap-2">
                                    <p
                                        className={`text-5xl tracking-tight font-extrabold`}
                                    >
                                        ${plan.price}
                                    </p>
                                    <div className="flex flex-col justify-end mb-[4px]">
                                        <p className="text-sm tracking-wide text-base-content/80 uppercase font-semibold">
                                            {plan.duration}
                                        </p>
                                    </div>
                                </div>

                                <ul className="space-y-2.5 leading-relaxed text-base flex-1">
                                    {[
                                        { name: 'Lister profile creation' },
                                        {
                                        name: 'Listing features access',
                                        subcategories: [
                                            'Appointment Management',
                                            'Create gallery',
                                            'Put your service/s on display',
                                        ]
                                        },
                                        { name: 'Searchable profile' },
                                    ].map((feature, i) => (
                                        <li key={i} className="flex flex-col">
                                        <div className="flex items-center gap-2">
                                            <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                            className="w-[18px] h-[18px] opacity-80 shrink-0"
                                            >
                                            <path
                                                fillRule="evenodd"
                                                d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                                                clipRule="evenodd"
                                            />
                                            </svg>
                                            <span>{feature.name}</span>
                                        </div>
                                        {/* Render subcategories if they exist */}
                                        {feature.subcategories && (
                                            <ul className="ml-6 space-y-1 text-sm text-gray-500">
                                            {feature.subcategories.map((subcat, j) => (
                                                <li key={j} className="mt-1 flex items-center gap-2">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                    className="w-[16px] h-[16px] opacity-60 shrink-0"
                                                >
                                                    <path
                                                    fillRule="evenodd"
                                                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                                                    clipRule="evenodd"
                                                    />
                                                </svg>
                                                <span>{subcat}</span>
                                                </li>
                                            ))}
                                            </ul>
                                        )}
                                        </li>
                                    ))}
                                </ul>
                                <div className="space-y-2">
                                    <a
                                        className="btn bg-white text-black dark:bg-black dark:text-white "
                                        target="_blank"
                                        href={
                                            plan.link +
                                            '?prefilled_email=' +
                                            session?.user?.email
                                        }
                                    >
                                        Purchase
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* <section className="fixed right-8 bottom-8">
                <a
                    href="https://shipfa.st?ref=stripe_pricing_viodeo"
                    className="bg-white font-medium inline-block text-sm border border-base-content/20 hover:border-base-content/40 hover:text-base-content/90 hover:scale-105 duration-200 cursor-pointer rounded text-base-content/80 px-2 py-1"
                >
                    <div className="flex gap-1 items-center">
                        <span>Built with</span>
                        <span className="font-bold text-base-content flex gap-0.5 items-center tracking-tight">
                            <Image
                                src={logo}
                                alt="ShipFast logo"
                                priority={true}
                                className="w-5 h-5"
                                width={20}
                                height={20}
                            />
                            ShipFast
                        </span>
                    </div>
                </a>
            </section> */}
        </>
    );
};

export default Pricing;