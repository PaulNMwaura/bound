export const metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy explaining how we collect and use data.",
};

export default function PrivacyPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <p className="mb-6 text-sm text-gray-500">
        Effective Date: January 1, 2026 <br />
        Last Updated: January 1, 2026
      </p>

      <Section title="1. Information We Collect">
        <ul className="list-disc ml-6 space-y-2">
          <li>Name and contact information</li>
          <li>Email address</li>
          <li>Booking and transaction history</li>
          <li>Messages exchanged on the platform</li>
          <li>Technical data (IP address, browser type)</li>
        </ul>
      </Section>

      <Section title="2. How We Use Information">
        <ul className="list-disc ml-6 space-y-2">
          <li>To provide and improve services</li>
          <li>To process payments</li>
          <li>To communicate with users</li>
          <li>To prevent fraud and abuse</li>
        </ul>
      </Section>

      <Section title="3. Sharing of Information">
        <p>
          We do not sell personal information. We may share data with:
        </p>
        <ul className="list-disc ml-6 space-y-2 mt-3">
          <li>Payment processors</li>
          <li>Email service providers</li>
          <li>Legal authorities when required by law</li>
        </ul>
      </Section>

      <Section title="4. Data Security">
        <p>
          We implement reasonable security measures to protect your
          information. However, no system is completely secure.
        </p>
      </Section>

      <Section title="5. Data Retention">
        <p>
          We retain personal data as long as necessary to provide services and
          comply with legal obligations.
        </p>
      </Section>

      <Section title="6. Your Rights">
        <p>
          Depending on your jurisdiction, you may have rights to access,
          correct, or delete your personal data.
        </p>
      </Section>

      <Section title="7. Cookies">
        <p>
          We may use cookies and similar technologies to improve user
          experience and analyze platform usage.
        </p>
      </Section>

      <Section title="8. Updates to This Policy">
        <p>
          We may update this Privacy Policy from time to time. Continued use
          of the platform indicates acceptance of changes.
        </p>
      </Section>

      <Section title="9. Contact">
        <p>Email: support@procklist.com</p>
      </Section>
    </main>
  );
}

function Section({ title, children }: any) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-semibold mb-3">{title}</h2>
      <div className="text-gray-700 space-y-3 leading-relaxed">
        {children}
      </div>
    </section>
  );
}