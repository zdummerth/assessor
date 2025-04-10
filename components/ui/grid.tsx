import React, { ReactNode } from "react";

type GridProps = {
  children: ReactNode;
};

export const Grid: React.FC<GridProps> = ({ children }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 w-full">
      {children}
    </div>
  );
};

type CardProps = {
  children: ReactNode;
};

export const Card: React.FC<CardProps> = ({ children }) => {
  return (
    <div className="border border-gray-200 rounded-lg shadow-sm shadow-foreground bg-gray-100 dark:bg-zinc-900 dark:border-gray-100">
      <div className="px-4 pb-4 pt-2">{children}</div>
    </div>
  );
};
