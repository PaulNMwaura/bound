export const metadata = {
  title: "Terms & Conditions | Procklist",
  description: "Terms and Conditions governing use of the Procklist platform.",
};

export default function TermsPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-6">Terms & Conditions</h1>

      <p className="mb-8 text-sm text-gray-500">
        Effective Date: [Insert Date] <br />
        Last Updated: [Insert Date]
      </p>

      <Intro />

      <Section title="1. Platform Role">
        <p>
          Procklist is an online marketplace that connects individuals seeking
          services (“Users”) with independent service providers (“Listers”).
        </p>

        <h3 className="font-semibold mt-4">We:</h3>
        <ul className="list-disc ml-6 space-y-1">
          <li>Provide a technology platform for listing and booking services</li>
          <li>Facilitate communication between Users and Listers</li>
          <li>May process payments on behalf of Listers</li>
        </ul>

        <h3 className="font-semibold mt-4">We do not:</h3>
        <ul className="list-disc ml-6 space-y-1">
          <li>Provide the listed services ourselves</li>
          <li>Employ Listers</li>
          <li>Control how services are performed</li>
          <li>Guarantee service outcomes</li>
        </ul>

        <p className="mt-4">
          All services are performed by independent third-party providers.
        </p>
      </Section>

      <Section title="2. Eligibility">
        <ul className="list-disc ml-6 space-y-2">
          <li>Be at least 18 years old</li>
          <li>Provide accurate registration information</li>
          <li>Comply with all applicable laws</li>
        </ul>
        <p className="mt-4">
          By registering, you represent and warrant that you meet these requirements.
        </p>
      </Section>

      <Section title="3. Account Registration">
        <ul className="list-disc ml-6 space-y-2">
          <li>Maintain accurate account information</li>
          <li>Keep login credentials confidential</li>
          <li>Accept responsibility for all activity under your account</li>
        </ul>
        <p className="mt-4">
          We reserve the right to suspend or terminate accounts that provide false information or violate these Terms.
        </p>
      </Section>

      <Section title="4. Services and Bookings">
        <ul className="list-disc ml-6 space-y-2">
          <li>A direct agreement is formed between the User and the Lister</li>
          <li>The Lister is solely responsible for delivering the service</li>
          <li>Pricing is set by the Lister unless otherwise specified</li>
        </ul>
        <p className="mt-4">
          Procklist is not responsible for the quality, safety, legality, or outcome of services provided.
        </p>
        <p>
          Procklist does not independently verify the credentials, licenses, insurance, or background of Listers unless explicitly stated
        </p>
      </Section>

      <Section title="5. Payments">
        <ul className="list-disc ml-6 space-y-2">
          <li>Users authorize us to charge their selected payment method</li>
          <li>We may deduct service fees before remitting funds to Listers</li>
          <li>All payments are final unless otherwise specified in a cancellation policy</li>
        </ul>
        <p className="mt-4">
          We are not responsible for disputes between Users and Listers but may facilitate resolution at our discretion.
        </p>
      </Section>

      <Section title="6. Cancellations & Refunds">
        <p>Cancellation policies may vary by Lister.</p>
        <p>Users agree to review cancellation terms before booking.</p>
        <p className="mt-3">Refunds, if any, are subject to:</p>
        <ul className="list-disc ml-6 space-y-2">
          <li>The Lister’s stated cancellation policy</li>
          <li>Platform policies</li>
          <li>Applicable law</li>
        </ul>
        <p className="mt-4">
          We reserve the right to issue refunds at our sole discretion to maintain marketplace integrity.
        </p>
      </Section>

      <Section title="7. Independent Contractor Relationship">
        <p>Listers are independent contractors.</p>
        <p className="mt-3">Nothing in these Terms creates:</p>
        <ul className="list-disc ml-6 space-y-2">
          <li>An employer-employee relationship</li>
          <li>A partnership</li>
          <li>A joint venture</li>
          <li>An agency relationship</li>
        </ul>
        <p className="mt-4">Listers are solely responsible for:</p>
        <ul className="list-disc ml-6 space-y-2">
          <li>Their own taxes</li>
          <li>Insurance</li>
          <li>Licenses</li>
          <li>Regulatory compliance</li>
        </ul>
      </Section>

      <Section title="8. User Conduct">
        <ul className="list-disc ml-6 space-y-2">
          <li>Violate any law</li>
          <li>Upload inappropriate, false or misleading content</li>
          <li>Harass, threaten, or harm others</li>
          <li>Attempt to bypass Platform payment systems</li>
          <li>Interfere with platform security</li>
        </ul>
        <p className="mt-4">
          We may suspend or terminate accounts that violate these rules.
        </p>
      </Section>

      <Section title="9. Reviews and Content">
        <p>Users may submit reviews and content.</p>
        <p className="mt-3">
          By posting content, you grant Procklist a non-exclusive, worldwide,
          royalty-free license to use, reproduce, and display that content in
          connection with the Services.
        </p>
        <p className="mt-3">
          We reserve the right to remove content that violates these Terms.
        </p>
      </Section>

      <Section title="10. Intellectual Property">
        <p>All Platform content, including:</p>
        <ul className="list-disc ml-6 space-y-2">
          <li>Branding</li>
          <li>Logos</li>
          <li>Software</li>
          <li>Designs</li>
          <li>Text and graphics</li>
        </ul>
        <p className="mt-4">
          are owned by Procklist or its licensors and protected by intellectual property laws.
        </p>
        <p>You may not reproduce or distribute Platform content without written permission.</p>
      </Section>

      <Section title="11. Limitation of Liability">
        <p>To the maximum extent permitted by law, Procklist shall not be liable for:</p>
        <ul className="list-disc ml-6 space-y-2">
          <li>Personal injury</li>
          <li>Property damage</li>
          <li>Service dissatisfaction</li>
          <li>Lost profits</li>
          <li>Indirect or consequential damages</li>
        </ul>
        <p className="mt-4">
          Our total liability shall not exceed the amount paid by you to the Platform in the preceding 12 months.
        </p>
      </Section>

      <Section title="12. Disclaimer of Warranties">
        <p>The Services are provided “AS IS” and “AS AVAILABLE.”</p>
        <p className="mt-3">We make no warranties regarding:</p>
        <ul className="list-disc ml-6 space-y-2">
          <li>Service availability</li>
          <li>Accuracy of listings</li>
          <li>Reliability of Listers</li>
          <li>Outcomes of booked services</li>
        </ul>
        <p className="mt-4">Use of the Platform is at your own risk.</p>
      </Section>

      <Section title="13. Indemnification">
        <p>
          You agree to indemnify and hold harmless Procklist from any claims,
          damages, or liabilities arising out of:
        </p>
        <ul className="list-disc ml-6 space-y-2">
          <li>Your use of the Services</li>
          <li>Your violation of these Terms</li>
          <li>Disputes between Users and Listers</li>
        </ul>
      </Section>

      <Section title="14. Termination">
        <ul className="list-disc ml-6 space-y-2">
          <li>Violation of these Terms</li>
          <li>Fraudulent activity</li>
          <li>Conduct harmful to the Platform</li>
        </ul>
        <p className="mt-4">
          Upon termination, your right to access the Services ends immediately.
        </p>
      </Section>

      <Section title="15. Governing Law">
        <p>
          These Terms shall be governed by the laws of the State of Massachusetts (MA),
          without regard to conflict-of-law principles.
        </p>
        <p className="mt-3">
          Any disputes shall be resolved in the courts located in Suffolk County, MA.
        </p>
      </Section>

      <Section title="16. Dispute Resolution">
        <p>Before filing a claim, parties agree to attempt informal resolution.</p>
        <p className="mt-3">
          We may require arbitration for disputes, except where prohibited by law.
        </p>
      </Section>

      <Section title="17. Modifications to Terms">
        <p>We may update these Terms at any time.</p>
        <p className="mt-3">If changes are material, we will:</p>
        <ul className="list-disc ml-6 space-y-2">
          <li>Update the “Last Updated” date</li>
          <li>Notify users where required by law</li>
        </ul>
        <p className="mt-4">
          Continued use of the Platform constitutes acceptance of the revised Terms.
        </p>
      </Section>

      <Section title="18. Contact Information">
        <p>Email: support@yourdomain.com</p>
        <p>Mailing Address: [Business Address]</p>
      </Section>
    </main>
  );
}

function Intro() {
  return (
    <p className="mb-10 text-gray-700 leading-relaxed">
      Welcome to Procklist (“Platform,” “Company,” “we,” “our,” or “us”).
      These Terms and Conditions (“Terms”) govern your access to and use of
      our website, applications, and related services (collectively, the “Services”).
      By creating an account, accessing, or using the Services, you agree to be
      bound by these Terms. If you do not agree, do not use the Services.
    </p>
  );
}

function Section({ title, children }: any) {
  return (
    <section className="mb-12">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="text-gray-700 space-y-3 leading-relaxed">
        {children}
      </div>
    </section>
  );
}