"use client";

import PdfSplitter from "./splitter";
import PdfMerger from "./merger";
// import ImagePrintPreview from "./image-print-preview";
// import FillableFormPdf from "./generate-pdf";

export default function PdfToolsDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 print:p-0">
      <h1 className="text-2xl font-bold mb-6 text-center print:hidden">
        PDF Tools
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg shadow p-4 print:hidden">
          <h2 className="text-lg font-semibold mb-4">Split a PDF</h2>
          <PdfSplitter />
        </div>

        <div className="border rounded-lg shadow p-4 print:hidden">
          <h2 className="text-lg font-semibold mb-4">Merge PDFs</h2>
          <PdfMerger />
        </div>
      </div>
      {/* Image Print Preview */}
      {/* <div className="">
        <h2 className="text-lg font-semibold mb-4 print:hidden">
          Image Print Preview
        </h2>
        <ImagePrintPreview />
      </div> */}
      {/* Prefilled PDF Generator */}
      {/* <div className="border rounded-lg shadow p-4 mt-6 print:hidden">
        <h2 className="text-lg font-semibold mb-4">Prefilled PDF Generator</h2>
        <FillableFormPdf />
      </div> */}
    </div>
  );
}
