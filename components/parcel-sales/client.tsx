"use client";

import React from "react";
import { Tables } from "@/database-types";
import FormattedDate from "../ui/formatted-date";
import SaleHistoryModal from "./history-modal";

type Parcel = Tables<"test_parcels">;

type SaleRow = {
  sale_id: string | number;
  date_of_sale: string | null;
  sale_year: number | null;
  net_selling_price: number | null;
  year: number | null;
  report_timestamp: string | null;
  test_sales_sale_types?: Array<{
    effective_date: string | null;
    test_sale_types: {
      id: number;
      sale_type: string;
      is_valid: boolean;
    } | null;
  }>;
};

export default function ClientParcelSales({
  parcel,
  data,
}: {
  parcel: Parcel;
  data: SaleRow[];
}) {
  if (!data || data.length === 0) {
    return <p className="text-gray-500">No sales found for this parcel.</p>;
  }

  // Helper: get the most recent type for a sale (by effective_date)
  const currentType = (row: SaleRow) => {
    const types = (row.test_sales_sale_types ?? [])
      .filter((t) => !!t.effective_date)
      .sort(
        (a, b) =>
          new Date(b.effective_date || 0).getTime() -
          new Date(a.effective_date || 0).getTime()
      );
    return types[0]?.test_sale_types?.sale_type ?? "—";
  };

  const latest = data[0];

  const fmt = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

  return (
    <div className="flex flex-col gap-2">
      {/* Recent sales list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {data.map((s) => (
          <div key={String(s.sale_id)} className="border rounded p-2">
            <div className="flex justify-between">
              <div className="font-semibold">
                {s.net_selling_price != null
                  ? fmt.format(s.net_selling_price)
                  : "—"}
              </div>
              <div className="text-xs text-gray-500">
                <FormattedDate date={s.date_of_sale || ""} />
              </div>
            </div>
            <div className="text-xs text-gray-600">
              Sale #{String(s.sale_id)}
            </div>
            <div className="text-xs text-gray-600">Type: {currentType(s)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
