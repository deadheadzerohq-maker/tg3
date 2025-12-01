export default function PrivacyPage() {
  return (
    <main style={{ minHeight: "100vh", padding: "32px 16px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <h1 style={{ fontSize: 32, marginBottom: 16 }}>Privacy Policy</h1>
        <p style={{ marginBottom: 16, opacity: 0.8 }}>
          This Privacy Policy explains how Deadhead Zero Logistics LLC ("we", "us", "our") collects, uses,
          and protects information in connection with the TenderGuard platform.
        </p>
        <h2 style={{ fontSize: 20, marginTop: 24, marginBottom: 8 }}>1. Information we collect</h2>
        <p style={{ marginBottom: 12 }}>
          We may collect information you provide directly, such as your name, email address, company details,
          billing information, and usage activity within the platform. We may also log technical data such as IP
          address, browser type, and device information for security and analytics.
        </p>
        <h2 style={{ fontSize: 20, marginTop: 24, marginBottom: 8 }}>2. How we use information</h2>
        <p style={{ marginBottom: 12 }}>
          We use your information to operate and improve the service, provide customer support, process payments,
          analyze usage, and communicate with you about updates, security notices, and relevant product information.
        </p>
        <h2 style={{ fontSize: 20, marginTop: 24, marginBottom: 8 }}>3. Sharing with third parties</h2>
        <p style={{ marginBottom: 12 }}>
          We may share information with trusted service providers who assist with hosting, analytics, payment
          processing, communications, and other operational functions. We do not sell your personal information.
        </p>
        <h2 style={{ fontSize: 20, marginTop: 24, marginBottom: 8 }}>4. Data security</h2>
        <p style={{ marginBottom: 12 }}>
          We implement reasonable technical and organizational measures to help protect your information. However,
          no system can be completely secure, and we cannot guarantee absolute security of your data.
        </p>
        <h2 style={{ fontSize: 20, marginTop: 24, marginBottom: 8 }}>5. Your choices</h2>
        <p style={{ marginBottom: 12 }}>
          You may update certain account information from within the product or by contacting us. You may also opt out
          of certain non-essential communications. Some notices, such as security or legal notifications, are required.
        </p>
        <h2 style={{ fontSize: 20, marginTop: 24, marginBottom: 8 }}>6. Contact</h2>
        <p style={{ marginBottom: 12 }}>
          If you have questions about this Privacy Policy, you can contact us using the support channels listed in the
          TenderGuard application or on our website.
        </p>
        <p style={{ marginTop: 24, opacity: 0.7 }}>Last updated: {new Date().getFullYear()}</p>
      </div>
    </main>
  );
}
