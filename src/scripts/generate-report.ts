import fs from "fs";
import showdown, { type ShowdownExtension } from "showdown";

import { config } from "../forecasting-2025/config.ts";

interface TocItem {
  level: number;
  id: string;
  text: string;
}

const toc: TocItem[] = [];
const footnotes: { [key: string]: string } = {};

const basicExtensions: ShowdownExtension[] = [
  {
    type: "output",
    regex: /<p><strong>Authors:.*<\/p>/,
    replace: (match: string) => {
      return `<div class="authors">${match}<\/div>`;
    },
  },
];

const tocExtension: ShowdownExtension = {
  type: "output",
  regex: /<h([2-3]) id="(.+?)">(.+?)<\/h[2-3]>/g,
  replace: (match: string, level: string, id: string, text: string): string => {
    toc.push({ level: parseInt(level) - 1, id, text });
    return match;
  },
};

const footnoteExtension: ShowdownExtension[] = [
  {
    type: "lang",
    regex: /\[\^(\d{1,3})\]: (.*)/g,
    replace: (match: string, a: string, b: string) => {
      footnotes[a] = b;
      return "";
    },
  },
  {
    type: "lang",
    /** This also supports escaped markdown footnote syntax */
    regex: /\\?\[\^(\d{1,3})\\?\]/g,
    replace: (match: string, a: string) => getFootnoteLink(a),
  },
];

function getFootnoteLink(a: string) {
  const footnoteText = stripMarkdownAndEscape(footnotes[a]);
  return `<sup id="fnref-${a}" class="footnote-ref tooltip"><a href="#fn-${a}">${a}</a><span class="tooltiptext">${footnoteText}</span></sup>`;
}

const imageExtension: ShowdownExtension = {
  type: "output",
  regex: /<img src=".*?" alt="([a-z_]+)" \/>/g,
  replace: (match: string, alt: string) => {
    return inlineSvg(`forecasting-2025/images/${alt}.svg`);
  },
};

/**
 * 1. Starts with a level-4 heading (<h4>).
 * 2. It can optionally be followed by one or more paragraphs (<p>).
 * 3. It must then have at least one unordered list (<ul>).
 * 4. After the initial list, it includes any and all content that comes after it.
 * 5. It stops right before it encounters the next heading (either <h2>, <h3>, or <h4>) or if it reaches the end of the document.
 */
const considerationListRegex =
  /(<h4[^>]*>[\s\S]*?<\/h4>\s*(?:<p>[\s\S]+?<\/p>)?\s*<ul>[\s\S]+?<\/ul>[\s\S]*?)(?=<h[2-4]|$)/g;

const considerationListExtension: ShowdownExtension = {
  type: "output",
  regex: considerationListRegex,
  replace: '<div class="consideration-list">$1</div>',
};

const referencesExtension: ShowdownExtension = {
  type: "output",
  regex: /(<h2 id="references">References<\/h2>[\s\S]*)/g,
  replace: '<div class="references-section">$1</div>',
};

const mainFindingsExtension: ShowdownExtension = {
  type: "output",
  regex: /(<h2 id="summary"[^>]*>Summary<\/h2>\s*<p>[\s\S]*?<\/p>\s*)<ul>/g,
  replace: '$1<ul class="main-findings">',
};

const converter = new showdown.Converter({
  ghCompatibleHeaderId: true,
  customizedHeaderId: true,
  extensions: [
    basicExtensions,
    tocExtension,
    considerationListExtension,
    footnoteExtension,
    imageExtension,
    referencesExtension,
    mainFindingsExtension,
  ],
});

const markdown = fs.readFileSync("src/forecasting-2025/report.md", "utf8");
const h2Index = markdown.indexOf("## ");
if (h2Index === -1) throw new Error("No H2 level heading found.");
const bodyContent = converter.makeHtml(markdown.substring(h2Index));

const headerHtml = `
  <header class="report-header">
    <div class="report-label">${config.header.label}</div>
    <h1 class="report-title">${config.header.heading}</h1>
    <p class="report-lead">${config.header.subtitle}</p>
  </header>
`;

const tocHtml = toc
  .map((item) => `<li class="toc-level-${item.level}"><a href="#${item.id}" class="nav-link">${item.text}</a></li>`)
  .join("\n");

const footnotesHtml = `
  <div class="footnotes">
    <h2>Footnotes</h2>
    <ol>
      ${Object.entries(footnotes)
        .map(
          ([key, value]) =>
            `<li id="fn-${key}">${converter.makeHtml(value)}<a href="#fnref-${key}" class="footnote-backref">↩</a></li>`
        )
        .join("\n")}
    </ol>
  </div>
`;

const authorLinks = config.meta.authors.map((author) => {
  const university = author.university ? ` (${author.university})` : "";
  return `<a href="${author.website}" target="_blank">${author.name}</a>${university}`;
});

const authorsHtml = beautifulJoin(authorLinks);

const sliderHtml = `
  <div class="hero-visual-slider">
    <div class="slides">
      ${config.heroSlides
        .map((slide, index) => ({ index, alt: slide.alt, svg: inlineSvg(`forecasting-2025/images/${slide.src}.svg`) }))
        .map(({ index, alt, svg }) => `<div class="slide" data-index="${index}" aria-label="${alt}">${svg}</div>`)
        .join("\n")}
    </div>
    <div class="slider-controls">
      <div><button class="arrow prev" aria-label="Previous slide">⬅</button></div>
      <div class="dots">
        ${config.heroSlides
          .map(
            (_, index) => `<button class="dot" data-index="${index}" aria-label="Go to slide ${index + 1}"></button>`
          )
          .join("\n")}
      </div>
      <div>
      <button class="arrow next" aria-label="Next slide">⮕</button>
      </div>
    </div>
  </div>
`;

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, viewport-fit=cover">
  <title>${config.header.title}</title>
  <meta name="description" content="${config.head.description}">
  <meta property="og:title" content="${config.head.title}">
  <meta property="og:description" content="${config.head.description}">
  <meta property="og:image" content="${config.head.image}">
  <meta property="og:url" content="${config.head.url}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="${config.head.twitterHandle}">
  <link rel="stylesheet" href="styles/main.css?v=${Date.now()}">
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-690N9JZYZC"></script>
</head>
<body>
  <div class="overlay"></div>
  <button class="menu-toggle" aria-expanded="false" aria-controls="navigation"><span class="menu-icon"></span></button>
  ${headerHtml}
  <div class="main-content-wrapper">
    <div class="main-content">
      ${sliderHtml}
      <div class="meta-block">
        <div class="meta-item">
          <span class="meta-label">${config.meta.authorsTitle}</span>
          <span class="meta-value">
            ${authorsHtml}
            ${getFootnoteLink("1")}
          </span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Published:</span>
          <span class="meta-value">${config.meta.publicationDate}</span>
        </div>
        <div class="meta-links">
          <a href="${config.meta.pdfLink}" target="_blank" class="meta-link">${config.meta.pdfLabel}</a>
          <a href="${config.meta.citeLink}" class="meta-link">${config.meta.citeLabel}</a>
        </div>
      </div>
      <nav class="toc" id="navigation">
        <h2>${config.tocTitle}</h2>
        <ul>
          ${tocHtml}
        </ul>
      </nav>
      <article class="report-body">
        ${bodyContent}
        ${footnotesHtml}
      </article>
    </div>
  </div>
  <script src="report-interactivity.js"></script>
</body>
</html>`;

fs.writeFileSync("forecasting-2025/index.html", html);

function stripMarkdownAndEscape(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function beautifulJoin(strings: Array<string>): string {
  if (strings.length < 2) {
    return strings.join("");
  } else {
    const copy = [...strings];
    const last = copy.pop();
    return copy.join(", ") + " & " + last;
  }
}

function inlineSvg(imagePath: string): string {
  if (fs.existsSync(imagePath)) {
    const content = fs.readFileSync(imagePath, "utf8");
    const transformedContent = content
      .replace(/<!\[CDATA\[([\s\S]+)\]\]>/g, "$1")
      .replaceAll('font-family: "Arial"', "")
      .replaceAll("font-weight: bold", "font-weight: 500");
    return transformedContent;
  }
  console.warn(`[Image Extension] SVG not found: ${imagePath}`);
  return `<div class="inlined-svg-error">Image '${imagePath}.svg' not found.</div>`;
}
