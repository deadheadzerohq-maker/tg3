export const metadata = { title: "TenderGuard Terms of Service" };

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16 space-y-6">
      <h1 className="text-3xl font-semibold">Terms of Service</h1>
      <p className="text-slate-300 text-sm">Effective: 2024</p>
      <div className="prose prose-invert max-w-none text-slate-200 prose-headings:text-slate-50 prose-strong:text-slate-50">
        <p>
          Deadhead Zero Logistics LLC operates the TenderGuard software platform. TenderGuard is a technology service that helps freight brokers evaluate carrier authority, insurance, and safety signals. TenderGuard is not a freight broker or load board and does not arrange transportation, hold freight dollars, or intermediate payments of any kind.
        </p>
        <p>
          By using TenderGuard, you agree to use all data and scoring for informational purposes only. You remain responsible for your own due diligence, compliance obligations, and verification with shippers, carriers, and regulators. No information provided by TenderGuard should be treated as legal, compliance, or safety advice.
        </p>
        <p>
          You agree not to misuse the service, attempt to reverse engineer it, or use it in violation of any applicable law. Service availability and features may change over time. Subscriptions renew on a monthly basis unless canceled. Refunds are not guaranteed.
        </p>
        <p>
          TenderGuard may link out to third-party sources (e.g., FMCSA/SAFER). Those systems are outside our control. We are not responsible for their accuracy, uptime, or terms.
        </p>
        <p>
          If you have questions about these terms, please contact Deadhead Zero Logistics LLC before using the platform.
        </p>
      </div>
    </main>
  );
}
