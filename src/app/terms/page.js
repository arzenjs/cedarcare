export const metadata = { title: "Terms of use" };

export default function TermsPage() {
  return (
    <div className="page-width prose-page max-w-3xl py-16">
      <h1 className="text-5xl text-cedar-dark">Terms of use</h1>
      <p><strong>Demo notice:</strong> CedarCare Family Clinic is a fictional business used to demonstrate web development. These terms are a starting point only and are not legal advice.</p>

      <h2>Not medical advice</h2>
      <p>Content on this website is general information. It is not a diagnosis or treatment advice. For emergencies, go to the nearest hospital or call your local emergency number.</p>

      <h2>Appointments</h2>
      <p>An appointment is confirmed when you see the confirmation page and receive a reference. To change or cancel, contact the clinic with your reference. The clinic may reschedule if a doctor becomes unavailable.</p>

      <h2>Acceptable use</h2>
      <p>Please do not submit false details, attempt to disrupt the service, or book slots you do not intend to use.</p>

      <h2>Demo data</h2>
      <p>Doctors, qualifications, addresses and contact details on this site are placeholders and do not describe a real healthcare provider.</p>
    </div>
  );
}
