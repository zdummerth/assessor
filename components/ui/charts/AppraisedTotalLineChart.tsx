"use client";
import React from "react";
import { Chart } from "react-google-charts";

// Options for the line chart
export const lineOptions = {
  title: "Appraised Total",
  hAxis: {
    title: "Year",
    format: "####",
  },
  vAxis: {
    title: "Appraised Total",
  },
  legend: { position: "none" },
};

interface ParcelData {
  year: number;
  appraised_total: number;
  // ... other fields if needed
}

interface AppraisedTotalLineChartProps {
  data: ParcelData[];
}

export default function AppraisedTotalLineChart({
  data,
}: AppraisedTotalLineChartProps) {
  // Sort the data by year ascending (oldest to newest)
  const sortedData = [...data].sort((a, b) => a.year - b.year);

  // Build the data table for Google Charts:
  // First row is the header and subsequent rows are the data points.
  const chartData = [
    ["Year", "Appraised Total"],
    ...sortedData.map((item) => [item.year, item.appraised_total]),
  ];

  // Dynamically set the height (optional)
  //   const height = sortedData.length * 50 + 200;

  return (
    <Chart
      chartType="LineChart"
      width="100%"
      height={`300px`}
      data={chartData}
      options={lineOptions}
    />
  );
}
