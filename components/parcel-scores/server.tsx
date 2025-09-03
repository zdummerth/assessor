// app/components/ServerScoresLite.tsx
import { createClient } from "@/utils/supabase/server";
import ClientScoresLite from "./client";

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

  return <ClientScoresLite rows={rows} className={className} title={title} />;
}
