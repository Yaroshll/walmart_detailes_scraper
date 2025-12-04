import * as XLSX from "xlsx";
import fs from "fs";
import path from "path";

// Create output folder if it doesn't exist
const outputDir = "./output";
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

export function saveToExcel(filenamePrefix, data) {
  const workbook = XLSX.utils.book_new();
  const sheet = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(workbook, sheet, "Products");

  // generate timestamp
  const now = new Date();
  const timestamp = now
    .toISOString()
    .replace(/T/, "_")
    .replace(/\..+/, "")
    .replace(/:/g, "-");

  const filename = `${filenamePrefix}_${timestamp}.csv`;
  const fullPath = path.join(outputDir, filename);

  // Write CSV
  XLSX.writeFile(workbook, fullPath, { bookType: "csv" });

  console.log(`📁 Saved CSV file: ${fullPath}`);
}
