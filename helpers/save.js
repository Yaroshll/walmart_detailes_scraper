import fs from "fs";
import * as XLSX from "xlsx";

export function saveJSON(data, filename = "output.json") {
  fs.writeFileSync(filename, JSON.stringify(data, null, 2));
  console.log("✅ JSON saved:", filename);
}

export function saveCSV(data, filename = "output.csv") {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
  XLSX.writeFile(workbook, filename, { bookType: "csv" });
  console.log("✅ CSV saved:", filename);
}
