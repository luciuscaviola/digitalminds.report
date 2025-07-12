# Digital Minds Forecasting Report

This project generates a static HTML report from a Markdown file. It uses a combination of Node.js, TypeScript, and Showdown to convert the Markdown content into a styled HTML page.

## Folder Structure

```
/
├── forecasting-2025/       # The generated HTML and CSS files
│   ├── styles/
│   │   └── main.css
│   └── index.html
├── src/
│   ├── forecasting-2025/   # Source files for the report
│   │   ├── header.ts
│   │   └── report.md
│   └── scripts/
│       └── generate-report.ts
├── package.json
├── tsconfig.json
└── README.md
```

## How it Works

The report generation is handled by the `src/scripts/generate-report.ts` script. This script uses the Showdown library to convert the Markdown content from `src/forecasting-2025/report.md` into HTML. It also uses a custom Showdown extension to add specific classes to the generated HTML for styling purposes.

The script is configured to use TypeScript for type safety and modern JavaScript features. It is executed directly by Node.js using the `--experimental-strip-types` flag, which allows for on-the-fly TypeScript compilation.

## Available Scripts

In the project directory, you can run the following scripts:

### `npm run generate`

This script generates the final HTML report. It reads the Markdown content, converts it to HTML, and saves the output to `forecasting-2025/index.html`.

### `npm run watch`

This script starts a file watcher that monitors the `src` directory for any changes. Whenever a file is modified, it automatically runs the `npm run generate` script to regenerate the report.

### `npm run tsc`

This script runs the TypeScript compiler with the `--noEmit` flag. This is useful for checking the project for any type errors without generating any output files.
