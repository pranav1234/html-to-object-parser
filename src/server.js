import fs from "fs";
import parseHTML from "./index.js";

const filePath = process.argv[2];

if (!filePath) {
  console.error("Please provide the path to the HTML file as an argument.");
  process.exit(1);
}

fs.readFile(filePath, "utf-8", (err, htmlContent) => {
  if (err) {
    console.error("Error reading the file:", err);
    process.exit(1);
  }
  const result = parseHTML(htmlContent);
  console.log(JSON.stringify(result, null, 2));
});
