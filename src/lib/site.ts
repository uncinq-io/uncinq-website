/**
 * Single source of truth for company facts that appear in several places
 * (header, footer, contact page, structured data, metadata).
 */
export const site = {
  name: "Uncinq",
  legalName: "Uncinq LLC",
  tagline: "Your partner in digital transformation",
  description:
    "Uncinq builds and modernises software for organisations in the US and East Africa — product engineering, cloud, and AI integration delivered by a team split across Washington DC and Kigali.",
  url: "https://uncinq.io",
  email: "info@uncinq.io",
  phone: "+1-202-594-9342",
  phoneHref: "+12025949342",
  locations: [
    { city: "Washington, DC", region: "United States" },
    { city: "Maryland", region: "United States" },
    { city: "Kigali", region: "Rwanda" },
  ],
  social: {
    linkedin: "https://www.linkedin.com/company/uncinq/",
    instagram: "https://www.instagram.com/uncinq_/",
  },
} as const;

export const navigation = [
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;
