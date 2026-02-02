import XLSX from "xlsx";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const filePath = join(root, "Parking Final 29012026.xlsx");

const workbook = XLSX.readFile(filePath);
console.log("Sheet names:", workbook.SheetNames);

for (const name of workbook.SheetNames) {
  const sheet = workbook.Sheets[name];
  const ref = sheet["!ref"] || "A1";
  console.log("Sheet ref:", ref);
  const range = XLSX.utils.decode_range(ref);
  const rowCount = range.e.r - range.s.r + 1;
  const colCount = range.e.c - range.s.c + 1;
  console.log("\n--- Sheet:", name, "---");
  console.log("Rows:", rowCount, "Cols:", colCount + 1);
  for (const maxRows of [3000, 10000, 50000]) {
    const readRef = `A1:CY${maxRows}`;
    const json = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "", range: readRef });
    const withFlat = json.filter((row, i) => i > 0 && row[1] != null && String(row[1]).trim() !== "");
    console.log(`Range 1-${maxRows}: rows read=${json.length}, with Flat No.=${withFlat.length}`);
    if (withFlat.length < json.length - 1) break;
  }
  const readRef = "A1:CY5000";
  const json = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "", range: readRef });
  const headers = json[0];
  console.log("Header indices 0-9:", headers.slice(0, 10));
}
