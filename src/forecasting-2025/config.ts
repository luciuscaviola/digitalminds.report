export const config = {
  head: {
    title: "Expert Forecasts about Digital Minds",
    description:
      "We asked experts to forecast scenarios involving computers with the capacity for subjective experience. They predict relatively short timelines, fast takeoff, and uncertain societal impacts.",
    url: "https://digitalminds.report",
    image: "https://digitalminds.report/images/timing.svg",
    twitterHandle: "@LuciusCaviola",
  },
  header: {
    title: "Futures with Digital Minds: Expert Forecasts in 2025",
    label: "Expert Forecasts in 2025",
    heading: "Futures with Digital Minds",
    subtitle:
      "Most expert participants consider it at least 50% likely that computers capable of subjective experience will exist by 2050. Once created, their collective welfare capacity is estimated to exceed humanity’s within a decade. Views diverge on whether their welfare will be positive and on their implications for AI safety, governance, and society at large.",
  },
  tocTitle: "Table of Contents",
  meta: {
    authorsTitle: "Authors:",
    authors: [
      {
        name: "Lucius Caviola",
        university: "University of Cambridge",
        website: "https://luciuscaviola.com",
      },
      {
        name: "Bradford Saad",
        university: "University of Oxford",
        website: "https://sites.google.com/a/brown.edu/brad-saad/",
      },
    ],
    publicationDate: "August 2025",
    pdfLink: "https://arxiv.org/abs/2508.00536",
    pdfLabel: "PDF version",
    codeLink: "/forecasting-2025/data/",
    codeLabel: "Data",
    citeLink:
      "javascript:prompt('Citation (press Ctrl+C or Cmd+C to copy):', 'Caviola, L., & Saad, B. (2025). Futures with digital minds: Expert forecasts in 2025 (arXiv:2508.00536). arXiv. https://arxiv.org/abs/2508.00536');void 0",
    citeLabel: "Cite",
  },
  heroSlides: [
    { src: "timing", alt: "Timing of AI development" },
    { src: "speed", alt: "Speed of digital mind takeoff" },
    { src: "net_welfare", alt: "Net welfare of digital minds" },
    { src: "public_belief", alt: "Public belief in digital minds" },
    { src: "moratorium", alt: "Support for a moratorium" },
    { src: "ai_safety", alt: "Interaction with AI safety" },
  ],
} as const;
