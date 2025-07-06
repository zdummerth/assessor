"use client";

import React from "react";

type TooltipButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  tooltip: string;
};

export default function TooltipButton({
  tooltip,
  className = "",
  children,
  ...props
}: TooltipButtonProps) {
  return (
    <div className="relative group inline-block">
      <button
        {...props}
        className={`p-2 rounded-full hover:bg-gray-200 transition ${className}`}
      >
        {children}
      </button>

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity text-xs bg-gray-800 text-white rounded py-1 px-2 z-10 whitespace-nowrap">
        {tooltip}
      </div>
    </div>
  );
}
