import {
  Rocket,
  Globe,
  Smartphone,
  PenTool,
  Sparkles,
  ShoppingCart,
  Cloud,
  type LucideIcon,
} from "lucide-react";

export type Service = {
  id: string;
  icon: LucideIcon;
  title: string;
  /** One line, used in the numbered expertise list on the homepage. */
  short: string;
  /** Fuller copy, used on the services page. */
  description: string;
  items: string[];
};

export const services: Service[] = [
  {
    id: "startup-software-development",
    icon: Rocket,
    title: "Startup Software Development",
    short:
      "Custom software for your first release, from an agreed scope through design, development, testing and launch.",
    description:
      "From an agreed brief to a working product, we bring design, development, testing and launch preparation together. Start with an existing specification or let us help define the build first — we agree scope, milestones and costs, show working progress, and prepare a documented handover.",
    items: [
      "Agreed scope, milestones & costs",
      "Design, development & testing",
      "Working progress every sprint",
      "Documented handover",
    ],
  },
  {
    id: "web-application-development",
    icon: Globe,
    title: "Web Application Development",
    short:
      "SaaS products, customer portals, and complex dashboards with enterprise-grade performance.",
    description:
      "SaaS products, customer portals, and complex dashboards built for enterprise-grade performance. We design the architecture, ship in stages, and keep the codebase maintainable long after launch.",
    items: [
      "SaaS products",
      "Customer portals",
      "Complex dashboards",
      "Enterprise-grade performance",
    ],
  },
  {
    id: "mobile-app-development",
    icon: Smartphone,
    title: "Mobile App Development",
    short:
      "iOS and Android apps your customers keep, native quality, one codebase where it makes sense.",
    description:
      "iOS and Android apps your customers keep — native quality, one codebase where it makes sense. Built to survive contact with real devices and real networks, offline states and app store review included.",
    items: [
      "iOS & Android",
      "Native quality",
      "One codebase where it makes sense",
      "Release & store management",
    ],
  },
  {
    id: "ui-ux-design",
    icon: PenTool,
    title: "UI/UX Design",
    short:
      "Interfaces designed as decisions, not decoration — flows, prototypes, and a system your developers can ship.",
    description:
      "Interfaces designed as decisions, not decoration. Research, flows and prototypes grounded in what your users are trying to get done, delivered as a design system your developers can ship.",
    items: [
      "User research & flows",
      "Wireframing & prototyping",
      "Interface design",
      "Design systems",
    ],
  },
  {
    id: "ai-data-solutions",
    icon: Sparkles,
    title: "AI & Data Solutions",
    short:
      "Practical AI assistants, automation and analytics, scoped around a clear use case.",
    description:
      "Practical AI assistants, automation and analytics, scoped around a clear use case. We start from a task worth automating, not from the model — then measure whether it actually holds up in production.",
    items: [
      "AI assistants",
      "Workflow automation",
      "Analytics over your own data",
      "Evaluation & guardrails",
    ],
  },
  {
    id: "e-commerce-development",
    icon: ShoppingCart,
    title: "E-commerce Development",
    short: "Stores and marketplaces built to convert, fast, localised, ready to scale.",
    description:
      "Stores and marketplaces built to convert — fast, localised, and ready to scale. From catalogue and checkout to payments and fulfilment, tuned for the markets you sell into.",
    items: [
      "Stores & marketplaces",
      "Checkout & payments",
      "Performance & conversion",
      "Localisation & scale",
    ],
  },
  {
    id: "cloud-devops",
    icon: Cloud,
    title: "Cloud & DevOps",
    short:
      "Infrastructure that deploys itself: CI/CD, cloud migration, monitoring, and cost control.",
    description:
      "Infrastructure that deploys itself: CI/CD, cloud migration, monitoring, and cost control. Planned around your constraints — budget, compliance, and the risk of moving a system people depend on.",
    items: [
      "CI/CD pipelines",
      "Cloud migration",
      "Monitoring & alerting",
      "Cost control",
    ],
  },
];
