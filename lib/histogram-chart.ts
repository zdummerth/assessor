// /lib/histogram-chart.ts
import { buildHistogramBins } from "@/lib/ratio-stats";

export type GChartHistogram = {
  data: any[]; // Google Charts DataTable array
  options: any; // Google Charts options
  hasRows: boolean;
};

/**
 * Build Google ColumnChart-compatible histogram data & options from ratios.
 * Keeps visual decisions (colors, ticks, tooltips) centralized.
 */
export function getHistogramChartData(
  ratios: number[],
  binWidth = 0.1
): GChartHistogram {
  const rows = buildHistogramBins(ratios, binWidth);

  const data = [
    [
      "Bin (start)",
      "Count",
      { role: "style" },
      { role: "tooltip", type: "string", p: { html: true } },
    ],
    ...rows.map((b) => {
      const next = b.bin + binWidth;
      const mid = b.bin + binWidth / 2;
      const diff = Math.abs(mid - 1);
      // soft traffic-light colors centered on ratio = 1
      const color = diff > 0.3 ? "#fecaca" : diff > 0.1 ? "#fde68a" : "#bbf7d0";
      const tip = `
        <div style="padding:6px 8px">
          <div><b>Bin:</b> ${b.bin.toFixed(1)} – ${next.toFixed(1)}</div>
          <div><b>Count:</b> ${b.count}</div>
        </div>`;
      return [Number(b.bin.toFixed(1)), b.count, color, tip];
    }),
  ];

  let options: any = { legend: "none" };
  if (rows.length) {
    const min = rows[0].bin;
    const max = rows[rows.length - 1].bin + binWidth;
    const ticks: number[] = [];
    for (let x = min; x <= max + 1e-9; x = +(x + binWidth).toFixed(10)) {
      ticks.push(+x.toFixed(1));
    }
    options = {
      legend: "none",
      tooltip: { isHtml: true, trigger: "focus" },
      bar: { groupWidth: "95%" },
      hAxis: { title: "Ratio", ticks, viewWindow: { min, max }, format: "0.0" },
      vAxis: {
        title: "Count",
        viewWindow: { min: 0 },
        gridlines: { color: "#eee" },
      },
      chartArea: { left: 60, right: 20, top: 20, bottom: 50 },
    };
  }

  return { data, options, hasRows: rows.length > 0 };
}
