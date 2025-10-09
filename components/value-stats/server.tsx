"use server";

import React from "react";
import { createClient } from "@/utils/supabase/server";
import StatsClient from "./client";

// --- Types matching the SQL function return shape
export type StatRow = {
  column_name: string; // e.g., "bldg_agriculture"
  mean: number | null;
  median: number | null;
  count_nonzero: number | null;
  sum_nonzero: number | null;
};

// --- Page (server) ---
export default async function ValueStats({ asOfDate }: { asOfDate: string }) {
  const supabase = await createClient();
  //@ts-expect-error js
  const { data: rows, error } = await supabase.rpc("get_value_stats_asof", {
    p_as_of_date: asOfDate,
  });

  if (error) {
    console.error("Error fetching stats:", error);
    return (
      <div className="text-red-600">Error loading stats: {error.message}</div>
    );
  }

  //@ts-expect-error js
  return <StatsClient rows={rows} asOfDate={asOfDate} />;
}
