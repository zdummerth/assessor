// app/components/ServerScoresLite.tsx
import { createClient } from "@/utils/supabase/server";

type FeatureBreakdown = Record<
  string,
  { coef: number; x: number; contrib: number }
>;

type ScoreRow = {
  y_pred: number | null;
  feature_breakdown: FeatureBreakdown | null;
};

function fmtUSD(n?: number | null) {
  if (n == null || Number.isNaN(Number(n))) return "—";
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(n));
}

function toSortedBreakdown(
  fb: FeatureBreakdown | null | undefined
): Array<{ term: string; coef: number; x: number; contrib: number }> {
  if (!fb) return [];
  return Object.entries(fb)
    .map(([term, v]) => ({
      term,
      coef: Number(v?.coef ?? 0),
      x: Number(v?.x ?? 0),
      contrib: Number(v?.contrib ?? 0),
    }))
    .filter((r) => r.x !== 0 && Number.isFinite(r.contrib))
    .sort((a, b) => Math.abs(b.contrib) - Math.abs(a.contrib));
}

export default async function ServerScoresLite({
  parcelId,
  runId = null,
  limit = 200,
  className = "",
  title = "Model Estimate",
}: {
  parcelId: number;
  runId?: number | null;
  limit?: number;
  className?: string;
  title?: string;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    // @ts-expect-error: rpc name typing varies by codegen
    "score_sales_with_model_with_coeff",
    {
      p_limit: limit,
      // p_run_id: runId,
      p_parcel_ids: [parcelId],
    }
  );

  if (error) {
    console.error("score_sales_with_model RPC error:", error);
    return (
      <div className={`rounded border p-3 text-sm text-red-700 ${className}`}>
        Failed to load model scores: {error.message}
      </div>
    );
  }

  const rows = (data ?? []) as ScoreRow[];

  if (!rows.length) {
    return (
      <div className={`rounded border p-3 text-sm text-gray-600 ${className}`}>
        No scores found.
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-base font-semibold">{title}</h3>
        <div className="text-xs text-gray-500">
          {rows.length === 1 ? "1 result" : `${rows.length} results`}
        </div>
      </div>

      <div className="space-y-4">
        {rows.map((r, idx) => {
          const contribs = toSortedBreakdown(r.feature_breakdown);
          const count = contribs.length;

          return (
            <div key={idx} className="rounded border">
              <div className="flex items-center justify-between p-3">
                {/* <div className="text-sm text-gray-600">Model Estimate</div> */}
                <div className="text-lg font-semibold">{fmtUSD(r.y_pred)}</div>
              </div>

              <div className="border-t">
                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer select-none p-3 text-sm hover:bg-gray-50">
                    <span className="font-medium">
                      Feature breakdown{count ? ` (${count})` : ""}
                    </span>
                    {/* caret */}
                    <span className="ml-3 transition-transform group-open:rotate-180">
                      ▾
                    </span>
                  </summary>

                  <div className="p-3 overflow-auto">
                    {!count ? (
                      <div className="text-sm text-gray-500">
                        No contributing features.
                      </div>
                    ) : (
                      <table className="min-w-[700px] w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr className="text-left">
                            <th className="p-2">Feature</th>
                            <th className="p-2">x</th>
                            <th className="p-2">Coef</th>
                            <th className="p-2">Contribution</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {contribs.map((c) => (
                            <tr key={c.term} className="align-top">
                              <td className="p-2 break-all">{c.term}</td>
                              <td className="p-2">
                                {new Intl.NumberFormat().format(c.x)}
                              </td>
                              <td className="p-2">
                                {new Intl.NumberFormat(undefined, {
                                  maximumFractionDigits: 6,
                                }).format(c.coef)}
                              </td>
                              <td className="p-2">{fmtUSD(c.contrib)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </details>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
