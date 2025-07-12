import fs from "fs";
import showdown, { type ShowdownExtension } from "showdown";

import { config } from "../forecasting-2025/header.ts";

const considerationListRegex = /(<h3[^<]+?<\/h3>\s*(?:<p>[\s\S]+?<\/p>)?\s*<ul>[\s\S]+?<\/ul>)/g;

interface TocItem {
  level: number;
  id: string;
  text: string;
}

const toc: TocItem[] = [];

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
    regex: /<blockquote>/g,
    replace: '<blockquote class="abstract">',
  },
  {
    type: "output",
    regex: /<h([1-6]) id="([a-zA-Z0-9-]+?)\2">(.+?) {#[a-zA-Z0-9-]+?}<\/h[1-6]>/g,
    replace: '<h$1 id="$2">$3</h$1>',
  },
];

const tocExtension: ShowdownExtension = {
  type: "output",
  regex: /<h([1-6]) id="(.+?)">(.+?)<\/h[1-6]>/g,
  replace: (match: string, level: string, id: string, text: string): string => {
    toc.push({ level: parseInt(level), id, text });
    return match;
  },
};

const considerationListExtension: ShowdownExtension = {
  type: "output",
  regex: considerationListRegex,
  replace: '<div class="consideration-list">$1</div>',
};

const converter = new showdown.Converter({ extensions: [basicExtendions, tocExtension, considerationListExtension] });

const markdown = fs.readFileSync("src/forecasting-2025/report.md", "utf8");

const bodyContent = converter.makeHtml(markdown);

const headerHtml = `
  <header class="report-header">
    <div class="report-label">${config.header.label}<\/div>
    <h1 class="report-title">${config.header.title}<\/h1>
    <p class="report-subtitle">${config.header.subtitle}<\/p>
  <\/header>
`;

const tocHtml = toc
  .map((item) => `<li class="toc-level-${item.level}"><a href="#${item.id}">${item.text}<\/a><\/li>`)
  .join("\n");

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${config.header.title}<\/title>
  <link rel="stylesheet" href="styles/main.css?v=${Date.now()}">
<\/head>
<body>
  <div class="top-bar">
    <a href="/" class="wordmark">
      <img src="digitalminds.svg" alt="Digital Minds Logo" class="logo">
      <span class="primary">digitalminds<\/span><span class="secondary">.report<\/span>
    <\/a>
    <div class="year">2025<\/div>
  <\/div>
  ${headerHtml}
  <div class="main-content-wrapper">
    <div class="main-content">
      <nav class="toc">
        <h2>${config.tocTitle}<\/h2>
        <ul>
          ${tocHtml}
        <\/ul>
      <\/nav>
      <article class="report-body">
        ${bodyContent}
      <\/article>
    <\/div>
  <\/div>
<\/body>
<\/html>`;

fs.writeFileSync("forecasting-2025/index.html", html);
