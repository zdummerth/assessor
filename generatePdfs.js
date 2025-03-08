const React = require("react");
const fs = require("fs");
const { pdf, Document, Page, Text } = require("@react-pdf/renderer");

// Define your PDF document without JSX
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

const generatePdf = async () => {
  const pdfDoc = pdf(MyDocument());
  const pdfBuffer = await pdfDoc.toBuffer();
  fs.writeFileSync("hello.pdf", pdfBuffer);
  console.log("PDF saved as hello.pdf");
};

generatePdf();
