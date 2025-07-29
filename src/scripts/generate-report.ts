import fs from "fs";
import showdown, { type ShowdownExtension } from "showdown";

import { config } from "../forecasting-2025/config.ts";

const considerationListRegex = /(<h4[^<]+?<\/h4>\s*(?:<p>[\s\S]+?<\/p>)?\s*<ul>[\s\S]+?<\/ul>)/g;

interface TocItem {
  level: number;
  id: string;
  text: string;
}

const toc: TocItem[] = [];
const footnotes: { [key: string]: string } = {};

const basicExtendions: ShowdownExtension[] = [
  {
    type: "output",
    regex: /<p><strong>Authors:.*<\/p>/,
    replace: (match: string) => {
      return `<div class="authors">${match}<\/div>`;
    },
  },
  {
    type: "output",
    regex: /<h([1-6]) id="([a-zA-Z0-9-]+?)\2">(.+?) {#[a-zA-Z0-9-]+?}<\/h[1-6]>/g,
    replace: '<h$1 id="$2">$3</h$1>',
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
    regex: /\[\^(\d{1,3})\]/g,
    replace: (match: string, a: string) => {
      const footnoteText = stripMarkdownAndEscape(footnotes[a]);
      return `<sup id="fnref-${a}" class="footnote-ref"><a href="#fn-${a}" title="${footnoteText}">${a}</a></sup>`;
    },
  },
];

const imageExtension: ShowdownExtension = {
  type: "output",
  regex: /<img src=".*?" alt="([a-z_]+)" \/>/g,
  replace: (match: string, alt: string) => {
    return `<img src="images/${alt}.svg" alt="${alt}" />`;
  },
};

const considerationListExtension: ShowdownExtension = {
  type: "output",
  regex: considerationListRegex,
  replace: '<div class="consideration-list">$1</div>',
};

const converter = new showdown.Converter({
  extensions: [basicExtendions, tocExtension, considerationListExtension, footnoteExtension, imageExtension],
});

const markdown = fs.readFileSync("src/forecasting-2025/report.md", "utf8");
const h2Index = markdown.indexOf("## ");
if (h2Index === -1) throw new Error("No H2 level heading found.");
const bodyContent = converter.makeHtml(markdown.substring(h2Index));

const headerHtml = `
  <header class="report-header">
    <div class="report-label">${config.header.label}</div>
    <h1 class="report-title">${config.header.heading}</h1>
    <p class="report-subtitle">${config.header.subtitle}</p>
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

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, viewport-fit=cover">
  <title>${config.header.title}</title>
  <link rel="stylesheet" href="styles/main.css?v=${Date.now()}">
</head>
<body>
  <div class="overlay"></div>
  <button class="menu-toggle" aria-expanded="false" aria-controls="navigation"><span class="menu-icon"></span></button>
  ${headerHtml}
  <div class="main-content-wrapper">
    <div class="main-content">
      <div class="meta-block">
        <div class="meta-item">
          <span class="meta-label">${config.meta.authorsTitle}</span>
          <span class="meta-value">
            ${config.meta.authors.map((author) => `${author.name} (${author.university})`).join(", ")}
          </span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Published:</span>
          <span class="meta-value">${config.meta.publicationDate}</span>
        </div>
        <div class="meta-links">
          <a href="${config.meta.pdfLink}" class="meta-link">${config.meta.pdfLabel}</a>
          <a href="${config.meta.dataLink}" class="meta-link">${config.meta.dataLabel}</a>
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
