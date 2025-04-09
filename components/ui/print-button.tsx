"use client";
import React from "react";

const PrintButton = ({ className = "" }: { className?: string }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <button onClick={handlePrint} className={className}>
      Print
    </button>
  );
};

export default PrintButton;
