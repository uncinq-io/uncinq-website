export type GalleryShot = {
  src: string;
  alt: string;
  caption: string;
};

export type ProjectDetail = {
  /** Short line under the product name on its own page. */
  tagline: string;
  /** Large image at the top of the product page. Defaults to the card cover. */
  heroImage?: string;
  heroImagePosition?: "top" | "center";
  /** Opening paragraphs describing what the product is. */
  overview: string[];
  /** What Uncinq contributed. */
  role: string[];
  platform: string;
  features: { title: string; body: string }[];
  gallery: GalleryShot[];
};

export type Project = {
  slug: string;
  name: string;
  category: string;
  summary: string;
  /** Card cover, path under /public. Falls back to a striped placeholder. */
  image?: string;
  /** object-position for the cover crop. */
  imagePosition?: "top" | "center";
  /** Present when the product has its own page at /work/<slug>. */
  detail?: ProjectDetail;
};

export const projects: Project[] = [
  {
    slug: "jeli",
    name: "Jeli",
    category: "Audio AI",
    summary:
      "Paste a link, a PDF or a topic and get it back as narrated audio in about 30 seconds.",
    image: "/jeli/jeli-2.png",
    imagePosition: "top",
    detail: {
      tagline: "Anything you want to read, narrated for you.",
      heroImage: "/jeli/jeli-1.png",
      heroImagePosition: "center",
      overview: [
        "Jeli turns things you meant to read into things you can listen to. Paste a link, drop in a PDF or lecture notes, or simply describe a topic — Jeli extracts the source, drafts a script, casts the voices and masters the audio, usually in about thirty seconds.",
        "It is not a text-to-speech wrapper. The script is written for the format you pick, so a six-minute summary, a fourteen-minute story and a twelve-minute panel discussion each read as though they were written that way from the start. Everything you generate lands in a personal library you can browse and search.",
      ],
      role: ["Product design", "Mobile app", "AI integration"],
      platform: "Mobile app",
      features: [
        {
          title: "Anything in, audio out",
          body: "Articles, PDFs, lecture notes, or a topic you describe. The pipeline extracts the source, drafts the script, casts the voices and masters the audio.",
        },
        {
          title: "Formats, not just narration",
          body: "Summary, narration, story or panel discussion — pick a length and a voice, and the script is written to suit that shape rather than read flat.",
        },
        {
          title: "Search that answers",
          body: "Ask for a briefing, a side-by-side comparison or a bedtime story. Every answer comes back with its sources and a play button.",
        },
        {
          title: "A library that builds itself",
          body: "Generated pieces collect into a personal library, browsable by category and searchable down to what was said inside a piece.",
        },
        {
          title: "Generation you can walk away from",
          body: "Researching, writing, generating audio and saving all run in the background, so you can close the app and come back when it is done.",
        },
        {
          title: "Built for listening",
          body: "A player with variable speed, a sleep timer and a full transcript for when you would rather read after all.",
        },
      ],
      gallery: [
        {
          src: "/jeli/jeli-5.png",
          alt: "Jeli home screen showing a personal audio library",
          caption: "Today — picks up where you left off",
        },
        {
          src: "/jeli/jeli-6.png",
          alt: "Jeli create screen with format and voice selection",
          caption: "Create — pick a format, length and voice",
        },
        {
          src: "/jeli/jeli-11.png",
          alt: "Jeli generation pipeline in progress",
          caption: "The pipeline, running in the background",
        },
        {
          src: "/jeli/jeli-8.png",
          alt: "Jeli browse screen showing categories",
          caption: "Browse — what everyone's hearing",
        },
        {
          src: "/jeli/jeli-9.png",
          alt: "Jeli search screen with example prompts",
          caption: "Search — conversational, with sources",
        },
        {
          src: "/jeli/jeli-12.png",
          alt: "Jeli player showing a generated audio piece",
          caption: "Player — speed, sleep timer and transcript",
        },
      ],
    },
  },
  {
    slug: "stayhafi",
    name: "stayHafi",
    category: "Travel",
    summary: "Booking stays and short-term rentals, made effortless.",
  },
  {
    slug: "adonai",
    name: "Adonai",
    category: "Faith",
    summary: "A Bible app for daily reading, study and reflection.",
  },
  {
    slug: "zani",
    name: "Zani",
    category: "Dating",
    summary: "Dating built around genuine connection.",
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

/** Only products that have a page of their own. */
export function getProjectsWithPages(): Project[] {
  return projects.filter((project) => project.detail);
}
