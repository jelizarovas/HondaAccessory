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
