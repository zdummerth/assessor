"use client";

import React from "react";
import { useModal } from "@/components/ui/modal-context";
import Modal from "@/components/ui/modal";
import { History } from "lucide-react";
import { Tables } from "@/database-types";
import FormattedDate from "../ui/formatted-date";

type Parcel = Tables<"test_parcels">;

type SaleRow = {
  sale_id: string | number;
  date_of_sale: string | null;
  net_selling_price: number | null;
  test_sales_sale_types?: Array<{
    effective_date: string | null;
    test_sale_types: {
      id: number;
      sale_type: string;
      is_valid: boolean;
    } | null;
  }>;
};

export default function SaleHistoryModal({
  parcel,
  sales,
}: {
  parcel: Parcel;
  sales: SaleRow[];
}) {
  const { currentModalId, openModal, closeModal } = useModal();
  const modalId = `sale-history-${parcel.id}`;
  const isOpen = currentModalId === modalId;

  const fmt = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

  return (
    <div>
      <button
        onClick={() => openModal(modalId)}
        className="hover:text-blue-700"
      >
        <History className="w-4 h-4" />
      </button>

      <Modal open={isOpen} onClose={closeModal} title="Sale History">
        <div className="p-2 text-sm text-gray-800 space-y-4">
          {sales.map((s) => (
            <div key={String(s.sale_id)} className="border-b pb-2 space-y-1">
              <div className="flex justify-between font-medium">
                <span>
                  Price:{" "}
                  {s.net_selling_price != null
                    ? fmt.format(s.net_selling_price)
                    : "—"}
                </span>
                <span>
                  Date: <FormattedDate date={s.date_of_sale || ""} />
                </span>
              </div>

              {s.test_sales_sale_types &&
                s.test_sales_sale_types.length > 0 && (
                  <div>
                    <div className="text-xs text-gray-500 mb-1">
                      Classifications:
                    </div>
                    <ul className="list-disc list-inside text-xs">
                      {[...s.test_sales_sale_types]
                        .sort(
                          (a, b) =>
                            new Date(b.effective_date || 0).getTime() -
                            new Date(a.effective_date || 0).getTime()
                        )
                        .map((t, i) => (
                          <li
                            key={`${s.sale_id}-${t.test_sale_types?.id}-${i}`}
                          >
                            <span className="font-medium">
                              {t.test_sale_types?.sale_type ?? "—"}
                            </span>{" "}
                            — effective{" "}
                            <FormattedDate date={t.effective_date || ""} />{" "}
                            {t.test_sale_types?.is_valid === false && (
                              <span className="ml-1 italic text-red-600">
                                (retired)
                              </span>
                            )}
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
