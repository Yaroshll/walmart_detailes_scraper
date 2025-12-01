import * as XLSX from "xlsx";

export function saveToExcel(filename, data) {
  const workbook = XLSX.utils.book_new();
  const sheet = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(workbook, sheet, "Products");
  XLSX.writeFile(workbook, filename);
  console.log(`Saved Excel file: ${filename}`);
}
