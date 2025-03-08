import React from "react";
import fs from "fs";
import { pdf, Document, Page, Text } from "@react-pdf/renderer";

const MyDocument = () =>
  React.createElement(
    Document,
    null,
    React.createElement(
      Page,
      null,
      React.createElement(Text, null, "Hello, World!")
    )
  );

async function generatePdf() {
  // Generate a Buffer from the document
  const pdfBuffer = await pdf(MyDocument()).toBuffer();
  // Write the buffer to a file
  fs.writeFileSync("hello.pdf", pdfBuffer);
  console.log("PDF saved as hello.pdf");
}

generatePdf();
