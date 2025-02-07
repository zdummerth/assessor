"use client";
import React, { useState } from "react";
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";

const PermitCard: React.FC<{ permit: any }> = ({ permit }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="bg-background shadow-lg rounded-lg border border-gray-200 p-2">
      <div className="flex items-center justify-evenly">
        <p className="text-md font-bold">{permit.year}</p>
        <p className="text-md">{permit.status}</p>
        <p className="font-semibold">${permit.cost.toLocaleString()}</p>
        <button
          onClick={toggleCollapse}
          className="hover:bg-blue-600 rounded-full"
        >
          {isCollapsed ? (
            <ArrowDownCircle size={24} />
          ) : (
            <ArrowUpCircle size={24} />
          )}
        </button>
      </div>

      {!isCollapsed && (
        <div className="mt-4 space-y-2 text-gray-600">
          <div>
            <span className="font-semibold">Type:</span> {permit.permit_type}
          </div>
          <div>
            <span className="font-semibold">Status:</span> {permit.status}
          </div>
          <div>
            <span className="font-semibold">Completion Date:</span>{" "}
            {permit.completion_date}
          </div>
          <div>
            <span className="font-semibold">Issued Date:</span>{" "}
            {permit.issued_date}
          </div>
          <div>
            <span className="font-semibold">Request:</span> {permit.request}
          </div>
        </div>
      )}
    </div>
  );
};

export default PermitCard;
