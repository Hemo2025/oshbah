import * as XLSX from "xlsx";

export function downloadProductTemplate() {
  const data = [
    [
      "name",
      "price",
      "oldPrice",
      "stock",
      "categories",
      "description",
      "usage",
      "ingredients",
      "seoTitle",
      "seoDescription",
      "seoSlug",
      "images",
    ],
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(data);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

  XLSX.writeFile(workbook, "oshbah-products-template.xlsx");
}
