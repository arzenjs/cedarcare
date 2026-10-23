import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ContactMessage from "@/models/ContactMessage";
import { validateContact } from "@/lib/validation";
import { rateLimit, clientIp } from "@/lib/security";
import { sendContactNotification } from "@/lib/email";

export async function POST(request) {
  const limit = rateLimit(`contact:${clientIp(request)}`, { limit: 5, windowMs: 10 * 60_000 });
  if (!limit.ok) return NextResponse.json({ ok: false, error: "Too many messages. Please try later." }, { status: 429 });

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real people never see or fill this hidden field, bots usually do.
  if (body?.website) return NextResponse.json({ ok: true });

  const parsed = validateContact(body);
  if (parsed.errors) return NextResponse.json({ ok: false, errors: parsed.errors }, { status: 400 });

  try {
    await connectDB();
    await ContactMessage.create(parsed.value);
  } catch (err) {
    console.error("Contact save failed:", err.message);
    return NextResponse.json({ ok: false, error: "We could not send your message. Please call us instead." }, { status: 500 });
  }
  await sendContactNotification(parsed.value); // best effort; the message is already saved
  return NextResponse.json({ ok: true });
}
