import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { InstagramIcon, LinkedInIcon } from "@/components/icons/social";
import { navigation, site } from "@/lib/site";
import { services } from "@/lib/services";
import { Logo } from "@/components/logo";
import { Container } from "@/components/ui/container";

// Derived so footer links can never drift from the services themselves.
const serviceLinks = services.map((service) => ({
  label: service.title,
  href: `/services#${service.id}`,
}));

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-ink-900">
      <Container className="py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
          <div>
            <Link href="/" aria-label={`${site.name} — home`}>
              <Logo className="h-7" />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-400">
              {site.tagline}. Engineering teams across Washington DC and Kigali.
            </p>
            <div className="mt-6 flex gap-3">
              <SocialLink
                href={site.social.linkedin}
                label="Uncinq on LinkedIn"
              >
                <LinkedInIcon size={15} />
              </SocialLink>
              <SocialLink
                href={site.social.instagram}
                label="Uncinq on Instagram"
              >
                <InstagramIcon size={15} />
              </SocialLink>
            </div>
          </div>

          <FooterColumn title="Company">
            {navigation.map((item) => (
              <FooterLink key={item.href} href={item.href}>
                {item.label}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="Services">
            {serviceLinks.map((item) => (
              <FooterLink key={item.href} href={item.href}>
                {item.label}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="Get in touch">
            <li>
              <a
                href={`mailto:${site.email}`}
                className="inline-flex items-center gap-2 text-sm text-ink-400 transition-colors hover:text-white"
              >
                <Mail size={14} /> {site.email}
              </a>
            </li>
            <li>
              <a
                href={`tel:${site.phoneHref}`}
                className="inline-flex items-center gap-2 text-sm text-ink-400 transition-colors hover:text-white"
              >
                <Phone size={14} /> {site.phone}
              </a>
            </li>
            <li className="pt-2 text-sm leading-relaxed text-ink-500">
              {site.locations.map((l) => l.city).join(" · ")}
            </li>
          </FooterColumn>
        </div>

        <div className="mt-14 border-t border-white/10 pt-8 text-sm text-ink-500">
          <p>
            © {new Date().getFullYear()} {site.legalName}, Maryland, USA. All
            rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-xs font-medium uppercase tracking-[0.16em] text-ink-300">
        {title}
      </h3>
      <ul className="mt-5 space-y-3">{children}</ul>
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm text-ink-400 transition-colors hover:text-white"
      >
        {children}
      </Link>
    </li>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={label}
      className="grid h-9 w-9 place-items-center rounded-full border border-white/12 text-ink-300 transition-colors hover:border-accent-500/50 hover:text-white"
    >
      {children}
    </a>
  );
}
