export const config = {
  head: {
    title: "Expert Forecasts about Digital Minds",
    description:
      "Experts assign ≥50% probability to conscious computers by 2050 and expect their welfare capacity to surpass humanity’s within a decade.",
    url: "https://digitalminds.report",
    image: "https://digitalminds.report/images/timing.svg",
    twitterHandle: "@LuciusCaviola",
  },
  header: {
    title: "Futures with Digital Minds: Expert Forecasts in 2025",
    label: "Expert Forecasts in 2025",
    heading: "Futures with Digital Minds",
    subtitle:
      "Most expert participants consider it at least 50% likely that computers capable of subjective experience will exist by 2050. Once created, their collective welfare capacity is estimated to exceed humanity’s within a decade. Views diverge on whether their welfare will be positive, AI safety implications, and socio‑political effects.",
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
        name: "Brad Saad",
        university: "University of Oxford",
        website: "https://sites.google.com/a/brown.edu/brad-saad/",
      },
    ],
    publicationDate: "August 2025",
    pdfLink: "digital_minds_forecasting_2025.pdf",
    pdfLabel: "PDF version",
    citeLink:
      "javascript:prompt('Citation (press Ctrl+C or Cmd+C to copy):', 'Caviola, L., & Saad, B. (2025). Futures with digital minds: Expert forecasts in 2025.');void 0",
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
