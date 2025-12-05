import * as XLSX from "xlsx";
import fs from "fs";
import path from "path";

// Create output folder if not exists
const outputDir = "./output";
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

export function saveToExcel(prefix, data) {
  if (!data || data.length === 0) {
    console.log("⚠️ No data to save!");
    return;
  }

  // Create workbook + sheet
  const workbook = XLSX.utils.book_new();
  const sheet = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(workbook, sheet, "Products");

  // timestamp name
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, "-");

  const fileName = `${prefix}_${timestamp}.csv`;
  const filePath = path.join(outputDir, fileName);

  // Write CSV
  XLSX.writeFile(workbook, filePath, { bookType: "csv" });

  console.log(`✅ File saved successfully: ${filePath}`);
}
