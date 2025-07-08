"use client";

import React, { useState } from "react";

const ImageToPDFPrinter = () => {
  const [images, setImages] = useState<string[]>([]);

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const readers = files.map((file) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then(setImages).catch(console.error);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-xl font-bold mb-4 print:hidden">
        Image to PDF Printer
      </h1>

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleUpload}
        className="mb-4 print:hidden"
      />

      {images.length > 0 && (
        <>
          <button
            onClick={handlePrint}
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 print:hidden"
          >
            Print to PDF
          </button>

          <div className="print-container print:w-full">
            {images.map((src, idx) => (
              <div key={idx} className="print:break-after-page w-full p-16">
                <img
                  src={src}
                  alt={`Upload ${idx + 1}`}
                  className="max-w-full h-auto block"
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ImageToPDFPrinter;
