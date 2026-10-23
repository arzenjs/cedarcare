import { clinic } from "@/config/clinic";

export const metadata = { title: "Privacy policy" };

export default function PrivacyPage() {
  return (
    <div className="page-width prose-page max-w-3xl py-16">
      <h1 className="text-5xl text-cedar-dark">Privacy policy</h1>
      <p><strong>Demo notice:</strong> this is a starting-point policy for a portfolio demonstration. It is not legal advice and does not claim compliance with any law. A real clinic must publish a policy that matches its actual data practices and the laws of its jurisdiction.</p>

      <h2>What we collect</h2>
      <p>When you book, we collect your name, phone number, email address, the doctor, service and time you chose, and an optional short note. If you use the contact form, we collect your name, email and message. We do not ask for medical history, records or date of birth.</p>

      <h2>Why we collect it</h2>
      <p>Only to manage your appointment, contact you about it, and answer your enquiries.</p>

      <h2>Who can see it</h2>
      <p>Authorised clinic staff can view appointment details. Email is sent through a transactional email provider (Resend). We do not sell your data.</p>

      <h2>How long we keep it</h2>
      <p>A real clinic would define a retention period here. For this demo, use fictional data only.</p>

      <h2>Contact</h2>
      <p>Questions about this policy: {clinic.email}.</p>
    </div>
  );
}
