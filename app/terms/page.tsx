export default function TermsPage() {
  return (
    <main style={{ minHeight: "100vh", padding: "32px 16px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <h1 style={{ fontSize: 32, marginBottom: 16 }}>Terms of Service</h1>
        <p style={{ marginBottom: 16, opacity: 0.8 }}>
          These Terms of Service govern your access to and use of TenderGuard, a software service operated by Deadhead
          Zero Logistics LLC ("we", "us", "our").
        </p>
        <h2 style={{ fontSize: 20, marginTop: 24, marginBottom: 8 }}>1. Technology platform only</h2>
        <p style={{ marginBottom: 12 }}>
          TenderGuard is a technology platform only. We do not arrange, broker, or tender freight, nor do we
          handle or hold freight payments. All transportation services and payments are agreed directly between brokers,
          carriers, shippers, and other counterparties.
        </p>
        <h2 style={{ fontSize: 20, marginTop: 24, marginBottom: 8 }}>2. No legal or compliance advice</h2>
        <p style={{ marginBottom: 12 }}>
          Information shown in the product, including carrier profiles, risk scores, authority or insurance status, and
          related data, is provided for informational purposes only. It is not legal, compliance, or safety advice.
          You are solely responsible for your own carrier selection, due diligence, and compliance.
        </p>
        <h2 style={{ fontSize: 20, marginTop: 24, marginBottom: 8 }}>3. Accounts and subscriptions</h2>
        <p style={{ marginBottom: 12 }}>
          Access to the service may require a paid subscription. You authorize us and our payment processors (such as
          Stripe) to charge your selected payment method on a recurring basis until you cancel. Subscription fees are
          generally non-refundable except where required by law.
        </p>
        <h2 style={{ fontSize: 20, marginTop: 24, marginBottom: 8 }}>4. Acceptable use</h2>
        <p style={{ marginBottom: 12 }}>
          You agree not to misuse the service, including but not limited to scraping, reselling data without permission,
          attempting to circumvent security, or using the platform for any unlawful purpose.
        </p>
        <h2 style={{ fontSize: 20, marginTop: 24, marginBottom: 8 }}>5. Limitation of liability</h2>
        <p style={{ marginBottom: 12 }}>
          To the maximum extent permitted by law, we are not liable for lost profits, lost freight, consequential
          damages, or indirect losses arising out of or in connection with the use of the service. Your exclusive
          remedy is to stop using the service.
        </p>
        <h2 style={{ fontSize: 20, marginTop: 24, marginBottom: 8 }}>6. Changes</h2>
        <p style={{ marginBottom: 12 }}>
          We may update these Terms from time to time. When we do, we will update the "Last updated" date and, where
          appropriate, provide additional notice. Your continued use of the service after changes become effective
          constitutes acceptance of the updated Terms.
        </p>
        <p style={{ marginTop: 24, opacity: 0.7 }}>Last updated: {new Date().getFullYear()}</p>
      </div>
    </main>
  );
}
