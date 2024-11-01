"use client";
import React from "react";
import { Chart } from "react-google-charts";

// export const data = [
//   ["City", "2010 Population", "2000 Population"],
//   ["New York City, NY", 8175000, 8008000],
//   ["Los Angeles, CA", 3792000, 3694000],
//   ["Chicago, IL", 2695000, 2896000],
//   ["Houston, TX", 2099000, 1953000],
//   ["Philadelphia, PA", 1526000, 1517000],
// ];

// Different options for non-material charts
export const options = {
  title: "Population of Largest U.S. Cities",
  //   chartArea: { width: "50%" },
  hAxis: {
    title: "Price",
    minValue: 0,
  },
  vAxis: {
    title: "Neighborhood",
  },
  //   bar: { groupWidth: "50px" },
};

export default function BarChart({ data }: { data: any }) {
  //   console.log(data);
  const dataLength = data.length;
  const height = dataLength * 40 + 200;
  return (
    <Chart
      // Bar is the equivalent chart type for the material design version.
      chartType="BarChart"
      width="100%"
      height={`${height}px`}
      data={data}
      options={options}
    />
  );
}
