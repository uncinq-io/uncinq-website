import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { site } from "@/lib/site";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.email("Please enter a valid email address"),
  company: z.string().trim().max(120).optional(),
  budget: z.string().trim().max(60).optional(),
  message: z
    .string()
    .trim()
    .min(20, "Please tell us a little more — 20 characters minimum")
    .max(4000),
  /**
   * Honeypot: real users never fill this, bots usually do. Deliberately
   * unconstrained so a filled value still parses — it is checked after
   * validation and answered with a fake success, so a bot learns nothing.
   */
  website: z.string().optional(),
});

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the form", issues: z.flattenError(parsed.error).fieldErrors },
      { status: 422 },
    );
  }

  const { name, email, company, budget, message, website } = parsed.data;

  // Honeypot tripped — respond as success so bots do not learn anything.
  if (website) return NextResponse.json({ ok: true });

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL ?? site.email;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !from) {
    console.error(
      "Contact form misconfigured: RESEND_API_KEY and CONTACT_FROM_EMAIL are required.",
    );
    return NextResponse.json(
      { error: "The form is temporarily unavailable. Please email us directly." },
      { status: 503 },
    );
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: email,
    subject: `New enquiry — ${name}${company ? ` (${company})` : ""}`,
    text: [
      `Name:    ${name}`,
      `Email:   ${email}`,
      `Company: ${company || "—"}`,
      `Budget:  ${budget || "—"}`,
      "",
      message,
    ].join("\n"),
  });

  if (error) {
    console.error("Resend send failed:", error);
    return NextResponse.json(
      { error: "We could not send your message. Please email us directly." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
