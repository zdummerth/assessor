import { count } from "console";

type Parcels = {
  asrparcelid: number;
  lowaddrnum: number;
  stname: string;
  zip: number;
  asdtotal: number;
};

type Stats = {
  max: number;
  avg: number;
  sum: number;
  count: number;
};

export default function AssessedReport({ stats }: { stats: Stats }) {
  const max = stats.max ? stats.max.toLocaleString() : 0;
  const avg = stats.avg ? Math.round(stats.avg).toLocaleString() : 0;
  const count = stats.count ? stats.count.toLocaleString() : 0;
  const sum = stats.sum ? stats.sum.toLocaleString() : 0;

  const metrics = [
    { label: "Total Assessed", value: sum },
    { label: "Max Assessed", value: max },
    {
      label: "Average Assessed",
      value: avg,
    },
    { label: "Number of Parcels", value: count },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="p-4 rounded-lg shadow-foreground shadow-sm flex flex-col items-center justify-center"
        >
          <h3 className="text-lg font-semibold mb-2">{metric.label}</h3>
          <p className="text-2xl font-bold">{metric.value ?? "N/A"}</p>
        </div>
      ))}
    </div>
  );
}
