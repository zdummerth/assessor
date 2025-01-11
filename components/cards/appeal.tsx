"use client";
import React, { useState } from "react";
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";

const AppealCard: React.FC<{ appeal: any }> = ({ appeal }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="bg-background shadow-lg rounded-lg border border-gray-200 p-2">
      <div className="flex items-center justify-between">
        <p className="text-md font-bold">{appeal.year}</p>
        <p className="text-md font-bold">{appeal.status_code}</p>
        <p className="font-semibold">
          ${appeal.total_difference.toLocaleString()}
        </p>
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
            <span className="font-semibold">Appeal Number:</span>{" "}
            {appeal.appeal_number}
          </div>
          <div>
            <span className="font-semibold">Year:</span> {appeal.year}
          </div>
          <div>
            <span className="font-semibold">Status:</span> {appeal.status_code}
          </div>
          <div>
            <span className="font-semibold">Before Land:</span>{" "}
            {appeal.before_land.toLocaleString()}
          </div>
          <div>
            <span className="font-semibold">Before Building:</span>{" "}
            {appeal.before_bldg.toLocaleString()}
          </div>
          <div>
            <span className="font-semibold">Before Total:</span>{" "}
            {appeal.before_total.toLocaleString()}
          </div>
          <div>
            <span className="font-semibold">After Land:</span>{" "}
            {appeal.after_land.toLocaleString()}
          </div>
          <div>
            <span className="font-semibold">After Building:</span>{" "}
            {appeal.after_bldg.toLocaleString()}
          </div>
          <div>
            <span className="font-semibold">After Total:</span>{" "}
            {appeal.after_total.toLocaleString()}
          </div>
          <div>
            <span className="font-semibold">Land Difference:</span>{" "}
            {appeal.land_difference.toLocaleString()}
          </div>
          <div>
            <span className="font-semibold">Building Difference:</span>{" "}
            {appeal.bldg_difference.toLocaleString()}
          </div>
          <div>
            <span className="font-semibold">Total Difference:</span>{" "}
            {appeal.total_difference.toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
};

export default AppealCard;
