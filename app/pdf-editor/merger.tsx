"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";

type OrderedFile = {
  file: File;
};

export default function PdfMerger() {
  const [fileInputs, setFileInputs] = useState<OrderedFile[]>([]);
  const [mergedFileName, setMergedFileName] = useState("merged.pdf");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).map((file) => ({
        file,
      }));
      setFileInputs(selectedFiles);
    }
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...fileInputs];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setFileInputs(updated);
  };

  const moveDown = (index: number) => {
    if (index === fileInputs.length - 1) return;
    const updated = [...fileInputs];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    setFileInputs(updated);
  };

  const handleMerge = async () => {
    if (fileInputs.length < 2) {
      alert("Please select at least two PDF files.");
      return;
    }

    const mergedPdf = await PDFDocument.create();

    for (const { file } of fileInputs) {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedBytes = await mergedPdf.save();
    const blob = new Blob([mergedBytes], { type: "application/octet-stream" });

    const reader = new FileReader();
    reader.onload = () => {
      const link = document.createElement("a");
      link.href = reader.result as string;
      link.download = mergedFileName.endsWith(".pdf")
        ? mergedFileName
        : `${mergedFileName}.pdf`;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
    reader.readAsDataURL(blob);
  };

  return (
    <div className="space-y-6">
      <input
        type="file"
        accept="application/pdf"
        multiple
        onChange={handleFileChange}
        className="block"
      />

      <div>
        <label className="block text-sm font-medium">Output File Name</label>
        <input
          type="text"
          value={mergedFileName}
          onChange={(e) => setMergedFileName(e.target.value)}
          className="w-full border p-2 rounded mt-1"
        />
      </div>

      {fileInputs.length > 0 && (
        <div className="space-y-2">
          <p className="font-medium text-sm">Reorder Files:</p>
          <ul className="space-y-2">
            {fileInputs.map((item, index) => (
              <li
                key={item.file.name}
                className="border p-2 rounded bg-white shadow-sm flex items-center justify-between"
              >
                <span className="text-sm">{item.file.name}</span>
                <div className="space-x-2">
                  <button
                    onClick={() => moveUp(index)}
                    className="text-xs bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                    disabled={index === 0}
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveDown(index)}
                    className="text-xs bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                    disabled={index === fileInputs.length - 1}
                  >
                    ↓
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={handleMerge}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
        disabled={fileInputs.length < 2}
      >
        Merge PDFs
      </button>
    </div>
  );
}
