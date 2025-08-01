# Digital Minds Forecasting Report

This project generates a static HTML report from a Markdown file. It uses a combination of Node.js, TypeScript, and Showdown to convert the Markdown content into a styled HTML page.

## Requirements

- Node.js v22 or above

## Folder Structure

```
/
├── forecasting-2025/       # The generated HTML and CSS files
│   ├── images/
│   │   ├── plot_25.svg
│   │   └── ...
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

## Content

The content for the report is sourced from a Google Docs document. To update it, export the document by going to `File > Download > Markdown (.md)` and save the file as `report.md` in the `src/forecasting-2025/` directory.

### Content Processing

When the report is generated, the script processes the `report.md` file and ignores all content before the first H2 heading (`## `). This is because the main heading, author details, etc. are sourced from the configuration in `src/forecasting-2025/config.ts`.

### Image Handling

During generation, the script also processes the image references in the Markdown file. It uses the alt text of the images, which follows the format `my_name`, to generate the correct file path to the corresponding SVG image in the `forecasting-2025/images/` directory. This allows for a seamless integration of the images from the Google Docs export into the final HTML report.

### Footnotes

The script supports standard Markdown footnotes (e.g., `[^1]`) as well as escaped footnotes (e.g., `\[^1]`). This is useful for manually adding multiple references to the same footnote in the Google Doc source content.

## Development Workflow

To get started with the project, follow these steps:

1.  **Install Node.js**: Make sure you have Node.js (v22 or above) installed on your system. You can download it from the [official Node.js website](https://nodejs.org/).
2.  **Install Dependencies**: Open your terminal, navigate to the project directory, and run the following command to install the required dependencies:
    ```
    npm install
    ```
3.  **Update Content**: Follow the instructions in the [Content](#content) section to update the `src/forecasting-2025/report.md` file.
4.  **Format the Report**: After updating the content, run the following command to format the Markdown file:
    ```
    npm run format
    ```
5.  **Generate the Report**: To generate the final HTML report, run the following command:
    ```
    npm run generate
    ```
    Alternatively, you can use `npm run watch` to automatically regenerate the report whenever you make changes to the source files.

## Available Scripts

In the project directory, you can run the following scripts:

### `npm run generate`

This script generates the final HTML report. It reads the Markdown content, converts it to HTML, and saves the output to `forecasting-2025/index.html`.

### `npm run watch`

This script starts a file watcher that monitors the `src` directory for any changes. Whenever a file is modified, it automatically runs the `npm run generate` script to regenerate the report.

### `npm run format`

This script formats the `src/forecasting-2025/report.md` file using Prettier. This is useful for ensuring consistent formatting and making it easier to review changes after updating the content from Google Docs.
