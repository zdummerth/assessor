"use client";
import React, { useState, ReactNode } from "react";
import { Filter, X } from "lucide-react";

interface SidebarProps {
  children: ReactNode;
  total: number;
}

const Sidebar: React.FC<SidebarProps> = ({ children, total }) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <>
      <div className="relative">
        {total > 0 && (
          <span className="absolute -top-4 -right-2 text-foreground font-bold bg-blue-500 w-6 h-6 rounded-full flex items-center justify-center">
            {total}
          </span>
        )}
        <button
          onClick={toggleSidebar}
          className="bg-background text-foreground border border-gray-700 rounded-md p-2 focus:outline-none"
        >
          {/* {isCollapsed ? ">" : "<"} */}
          <Filter className="w-6 h-6" />
        </button>
      </div>
      <div
        className={`fixed top-0 left-0 h-full w-full text-foreground bg-background transition-all duration-300 overflow-scroll ${
          isCollapsed ? "opacity-[0] -z-10" : "opacity-[1] z-[999999]"
        }`}
      >
        <div className="flex justify-end p-4">
          <button
            onClick={toggleSidebar}
            className="bg-background text-foreground border border-gray-700 rounded-md p-2 focus:outline-none"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </>
  );
};

export default Sidebar;
