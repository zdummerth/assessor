import { createClient } from "@/lib/supabase/server";
import ClientScoresLite from "./client";
import { SearchX } from "lucide-react";

export type FeatureBreakdown = Record<
  string,
  { coef: number; x: number; contrib: number }
>;

export type ScoreRow = {
  y_pred: number | null;
  feature_breakdown: FeatureBreakdown | null;
};

export default async function ServerScoresLite({
  parcelId,
  runId = null,
  limit = 200,
  className = "",
  title,
}: {
  parcelId: number;
  runId?: number | null;
  limit?: number;
  className?: string;
  title?: string;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
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
      <section className={`rounded-lg border bg-white p-4 ${className}`}>
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        <div className="mt-3 flex items-center gap-2 text-sm text-red-700">
          <SearchX className="w-4 h-4" />
          <span>Failed to load model scores: {error.message}</span>
        </div>
      </section>
    );
  }

  const rows = (data ?? []) as ScoreRow[];

  if (!rows.length) {
    return (
      <section className={className}>
        <h3 className="text-sm font-semibold text-foreground/80">{title}</h3>
        <div className="mt-3 text-foreground/80">No scores found.</div>
      </section>
    );
  }

  return (
    <section className={className}>
      <ClientScoresLite rows={rows} title={title} />
    </section>
  );
}
