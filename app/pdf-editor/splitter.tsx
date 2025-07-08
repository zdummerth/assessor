"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";

export default function PdfSplitter() {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null);

  const handleLoad = async (f: File) => {
    const arrayBuffer = await f.arrayBuffer();
    const doc = await PDFDocument.load(arrayBuffer);
    const pages = doc.getPageCount();

    setFile(f);
    setPdfDoc(doc);
    setTotalPages(pages);
    setSelectedPages(Array.from({ length: pages }, (_, i) => i)); // select all by default
  };

  const togglePage = (index: number) => {
    setSelectedPages((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const toggleSelectAll = () => {
    if (selectedPages.length === totalPages) {
      setSelectedPages([]);
    } else {
      setSelectedPages(Array.from({ length: totalPages }, (_, i) => i));
    }
  };

  const downloadSelectedPages = async () => {
    if (!pdfDoc || !file) return;

    const baseName = file.name.replace(/\.pdf$/i, "");

    for (const i of selectedPages) {
      const newPdf = await PDFDocument.create();
      const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
      newPdf.addPage(copiedPage);

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${baseName}-page-${i + 1}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-xl font-bold">PDF Page Splitter</h1>

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleLoad(f);
        }}
        className="block"
      />

      {totalPages > 0 && (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border rounded">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="px-3 py-2">
                    <input
                      type="checkbox"
                      checked={selectedPages.length === totalPages}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="px-3 py-2">Page Number</th>
                  <th className="px-3 py-2">File Name</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: totalPages }, (_, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-3 py-2">
                      <input
                        type="checkbox"
                        checked={selectedPages.includes(i)}
                        onChange={() => togglePage(i)}
                      />
                    </td>
                    <td className="px-3 py-2">Page {i + 1}</td>
                    <td className="px-3 py-2">
                      {file
                        ? file.name.replace(/\.pdf$/i, "") +
                          `-page-${i + 1}.pdf`
                        : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={downloadSelectedPages}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
          >
            Download Selected Pages
          </button>
        </>
      )}
    </div>
  );
}
