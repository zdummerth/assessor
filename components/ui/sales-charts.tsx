"use client";
import { Chart } from "react-google-charts";

export default function SalesCharts({ data }: { data: any }) {
  // console.log(data);
  const chartData = [["Ratio"], ...data.map((row: any) => [row])];

  // console.log(chartData);
  const options = {
    title: "Distribution",
    legend: { position: "none" },
    colors: ["#4285F4"],
    // chartArea: { width: 401 },
    // hAxis: {
    //   ticks: [
    //     0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4,
    //     1.5, 1.6, 1.7, 1.8, 1.9, 2, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9,
    //     3,
    //   ],
    // },
    // bar: { gap: 0 },
    histogram: {
      bucketSize: 0.1,
      maxNumBuckets: 30,
      minValue: 0,
      maxValue: 3,
      lastBucketPercentile: 5,
    },
  };
  return (
    <div className="mt-6 flow-root">
      <Chart
        chartType="Histogram"
        width="100%"
        height="400px"
        data={chartData}
        options={options}
      />
    </div>
  );
}
