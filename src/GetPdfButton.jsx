import React from "react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import download from "downloadjs";

export const GetPdfButton = ({ totalPrice, pdfName, accessoriesData, selectedAccessories }) => {
  return (
    <button
      onClick={() => fillPDF(pdfName, accessoriesData, selectedAccessories)}
      className="lg:px-4 px-2 bg-indigo-500 hover:bg-indigo-700 transition-all text-white lg:py-2005%20honda%20cr-v202 py-0.5 rounded mr-2"
    >
      🛒??? ${totalPrice}{" "}
    </button>
  );
};
const formCodeToFieldMapping = (code) => ({
  checkboxCode: `AC${code}`,
  priceCode: `AP${code}`,
});

async function fillPDF(pdfName, accessoriesData, selectedAccessories) {
  // const baseUrl = window.location.origin.toString() /*+ import.meta.env.PUBLIC_URL*/ + "/";
  // console.log(baseUrl, import.meta.env.PUBLIC_URL, pdfName);
  // const formUrl = baseUrl + pdfName;
  const basePath = import.meta.env.BASE_URL;
  console.log(import.meta.env.BASE_URL); // works in localhos
  // const formUrl = new URL(pdfName, basePath).href;
  const formUrl = `${basePath}${pdfName}`;
  console.log({ pdfName, basePath, formUrl });

  const formPdfBytes = await fetch(formUrl).then((res) => res.arrayBuffer());
  const pdfDoc = await PDFDocument.load(formPdfBytes);
  const form = pdfDoc.getForm();

  Object.values(accessoriesData).forEach((category) => {
    Object.entries(category).forEach(([aId, accessory]) => {
      const mapping = formCodeToFieldMapping(accessory.pdfFormCode);

      let finalPrice = parseFloat(accessory.price).toFixed(2);

      // Check if there's an adjusted price in selectedAccessories and if it's less than the default price
      if (selectedAccessories[aId] && selectedAccessories[aId] < accessory.price) {
        finalPrice = parseFloat(selectedAccessories[aId]).toFixed(2);
      }

      // Fill the price
      const priceField = form.getTextField(mapping.priceCode);
      priceField.setText(String(finalPrice));

      // Check the checkbox if the accessory is selected
      const checkbox = form.getCheckBox(mapping.checkboxCode);
      if (selectedAccessories[aId]) {
        checkbox.check();
      } else {
        checkbox.uncheck();
      }
    });
  });

  form.flatten();
  await pdfDoc.save();

  const now = new Date();

  return download(await pdfDoc.save(), `DOCs ${getFormattedDate(now, " ")}.pdf`, "application/pdf");
}

const setField = (pdfField, value, form, condition = false) => {
  if (!pdfField || !value || condition) return;
  if (Array.isArray(value)) value = value.join(", ");
  const f = form.getTextField(pdfField);
  if (!f) return;
  return f.setText(value.toString());
};

function getFormattedDate(date, separator = "/") {
  let year = date.getFullYear();
  let month = (1 + date.getMonth()).toString().padStart(2, "0");
  let day = date.getDate().toString().padStart(2, "0");

  return month + separator + day + separator + year;
}
