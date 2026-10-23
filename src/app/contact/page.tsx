import type { Metadata } from "next";
import { Mail, Phone, MapPin } from "lucide-react";
import { site } from "@/lib/site";
import { PageHeader } from "@/components/page-header";
import { Container } from "@/components/ui/container";
import { ContactForm } from "@/components/contact-form";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Contact",
  description: `Talk to ${site.name} about product engineering, cloud, and AI integration. Offices in Washington DC, Maryland, and Kigali.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Tell us what you're building"
        lede="Send us the shape of it — an idea, a rough spec, or a product already live that needs work. We come back with a point of view, not a brochure, within one business day."
      />

      <Container className="py-20 lg:py-28">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <Reveal className="space-y-10">
            <div>
              <h2 className="text-sm font-medium uppercase tracking-[0.16em] text-ink-300">
                Direct
              </h2>
              <ul className="mt-6 space-y-4">
                <li>
                  <a
                    href={`mailto:${site.email}`}
                    className="inline-flex items-center gap-3 text-ink-200 transition-colors hover:text-white"
                  >
                    <Mail size={17} className="text-accent-500" />
                    {site.email}
                  </a>
                </li>
                <li>
                  <a
                    href={`tel:${site.phoneHref}`}
                    className="inline-flex items-center gap-3 text-ink-200 transition-colors hover:text-white"
                  >
                    <Phone size={17} className="text-accent-500" />
                    {site.phone}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-sm font-medium uppercase tracking-[0.16em] text-ink-300">
                Offices
              </h2>
              <ul className="mt-6 space-y-4">
                {site.locations.map((location) => (
                  <li
                    key={location.city}
                    className="flex items-start gap-3 text-ink-200"
                  >
                    <MapPin size={17} className="mt-0.5 text-accent-500" />
                    <span>
                      {location.city}
                      <span className="block text-sm text-ink-500">
                        {location.region}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <ContactForm />
          </Reveal>
        </div>
      </Container>
    </>
  );
}
