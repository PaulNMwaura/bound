'use client';

import { useSession, signIn } from 'next-auth/react';

// Customer portal link
const customerPortalLink =
    'https://billing.stripe.com/p/login/test_eVa0142fNekb15S3cc';

const ButtonCustomerPortal = () => {
    const { data: session, status } = useSession();

    if (status === 'authenticated') {
        return (
            <a
                href={
                    customerPortalLink +
                    '?prefilled_email=' +
                    session.user?.email
                }
                className="btn btn-primary-alt"
            >
                Billing
            </a>
        );
    }

    return (
        <button className="btn" onClick={signIn}>
            Login
        </button>
    );
};

export default ButtonCustomerPortal;