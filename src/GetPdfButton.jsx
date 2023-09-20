import React from "react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import download from "downloadjs";
async function createPdf() {
  const pdfDoc = await PDFDocument.create();
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const fontSize = 30;
  page.drawText("Creating PDFs in JavaScript is awesome!", {
    x: 50,
    y: height - 4 * fontSize,
    size: fontSize,
    font: timesRomanFont,
    color: rgb(0, 0.53, 0.71),
  });
  const pdfBytes = await pdfDoc.save();

  download(pdfBytes, "text.pdf", "application/pdf");
}

export const GetPdfButton = ({ totalPrice }) => {
  return (
    <button onClick={() => createPdf()} className="px-4 bg-indigo-400 py-2 rounded mr-2">
      Get ${totalPrice}{" "}
    </button>
  );
};

async function fillPDF(data) {
  // const pdfDoc = await PDFDocument.create();
  // const form = pdfDoc.getForm();

  // const pdfs = ["pdf/Arbitration agreement.pdf", "Buyers Guide mk.pdf","As Is Disclaimer.pdf","pdf/Buyers order.PDF", ];

  const baseUrl = window.location.origin.toString() + process.env.PUBLIC_URL + "/";
  const mergeDoc = await PDFDocument.create();

  for (const pdf of pdfs) {
    const formUrl = baseUrl + pdf.name;
    const formPdfBytes = await fetch(formUrl).then((res) => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(formPdfBytes);
    const form = pdfDoc.getForm();
    Object.entries(pdf.fields).forEach(([fieldName, f]) => {
      //   console.log({ fieldName, value: data[f] });
      setField(fieldName, data[f], form);
    });

    form.flatten();
    await pdfDoc.save();

    const coppiedTempPages = await mergeDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());

    coppiedTempPages.forEach((page) => mergeDoc.addPage(page));
  }

  const now = new Date();

  return download(
    await mergeDoc.save(),
    `DOCs ${data.year} ${data.make} ${data.model} ${data.fullName} ${getFormattedDate(now, " ")}.pdf`,
    "application/pdf"
  );
}

const setField = (pdfField, value, form, condition = false) => {
  if (!pdfField || !value || condition) return;
  if (Array.isArray(value)) value = value.join(", ");
  const f = form.getTextField(pdfField);
  if (!f) return;
  return f.setText(value.toString());
};

const pdfs = [
  {
    name: "pdfs/CR-V2024-form.pdf",
    fields: {
      AC001: "All-Season Floor Mats",
    },
  },
];

const dealer = {
  dealerName: "Leaf Autos LLC",
  dealerPhone: "(206) 602-4363",
  dealerAddress: "2501 B Harbor Ave SW, Seattle, WA 98126",
  dealerEmail: "leafautos@gmail.com",
};

function getFormattedDate(date, separator = "/") {
  let year = date.getFullYear();
  let month = (1 + date.getMonth()).toString().padStart(2, "0");
  let day = date.getDate().toString().padStart(2, "0");

  return month + separator + day + separator + year;
}
