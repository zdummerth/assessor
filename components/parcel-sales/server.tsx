// app/components/SalesWithStructuresCardsServer.tsx
import { createClient } from "@/utils/supabase/server";
import graphql from "@/utils/supabase/graphql";

type GQLEdge<T> = { node: T };

type SaleType = {
  id: number;
  sale_type: string | null;
  is_valid: boolean | null;
  created_at: string | null;
  retired_at: string | null;
};

type Sale = {
  sale_id: number;
  date_of_sale: string; // ISO
  net_selling_price: number | null;
  test_sales_sale_typesCollection?: {
    edges: GQLEdge<{
      effective_date: string | null;
      test_sale_types: SaleType;
    }>[];
  };
};

type Condition = {
  id: number;
  condition: string;
  effective_date: string; // ISO
  created_at: string;
};

type Structure = {
  id: number;
  parcel_id: number;
  year_built: number | null;
  full_bathrooms: number | null;
  half_bathrooms: number | null;
  test_conditionsCollection?: { edges: GQLEdge<Condition>[] };
};

function unwrapEdges<T>(edges?: GQLEdge<T>[]) {
  return (edges ?? []).map((e) => e.node);
}
function fmtUSD(n: number | null | undefined) {
  if (n == null) return "—";
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}
function fmtDate(s?: string | null) {
  if (!s) return "—";
  const d = new Date(s);
  return isNaN(+d) ? "—" : d.toLocaleDateString();
}
function pickAsOfCondition(conds: Condition[], saleDateISO: string) {
  const saleDate = new Date(saleDateISO);
  const candidates = conds
    .filter((c) => {
      const ed = new Date(c.effective_date);
      return !isNaN(+ed) && ed <= saleDate;
    })
    .sort((a, b) => +new Date(b.effective_date) - +new Date(a.effective_date));
  return candidates[0] ?? null;
}

export default async function SalesWithStructuresCardsServer({
  parcelId,
}: {
  parcelId: number;
}) {
  const supabase = await createClient();

  // GraphQL: parcel → sales + parcel → structures(+conditions)
  const query = /* GraphQL */ `
    query GetParcelSales($parcelId: BigInt!) {
      test_parcel_salesCollection(filter: { parcel_id: { eq: $parcelId } }) {
        edges {
          node {
            parcel_id
            test_sales {
              sale_id
              date_of_sale
              net_selling_price
              test_sales_sale_typesCollection {
                edges {
                  node {
                    effective_date
                    test_sale_types {
                      id
                      sale_type
                      is_valid
                      created_at
                      retired_at
                    }
                  }
                }
              }
            }
          }
        }
      }

      # Use parcel_id to fetch all structures on the parcel
      test_structuresCollection(filter: { id: { eq: $parcelId } }) {
        edges {
          node {
            id
            year_built
            full_bathrooms
            half_bathrooms
            test_conditionsCollection {
              edges {
                node {
                  id
                  condition
                  effective_date
                  created_at
                }
              }
            }
          }
        }
      }
    }
  `;

  const res = await graphql(query, { parcelId }, supabase);
  console.log("SalesWithStructuresCardsServer: GraphQL response", res);

  const salesNodes =
    res?.data?.test_parcel_salesCollection?.edges?.map((e: any) => e.node) ??
    [];
  const sales: Sale[] = salesNodes.flatMap((n: any) => n?.test_sales ?? []);

  const structures: Structure[] =
    res?.data?.test_structuresCollection?.edges?.map((e: any) => e.node) ?? [];

  console.log("SalesWithStructuresCardsServer: sales", sales);
  // console.log("SalesWithStructuresCardsServer: structures", structures);

  // Flatten conditions on server
  const structsWithConds = structures.map((s) => ({
    ...s,
    conditions: unwrapEdges<Condition>(s.test_conditionsCollection?.edges),
  }));

  // Build cards: one per (sale × structure), compute condition as-of sale date
  const cards = sales.flatMap((sale) =>
    structsWithConds.map((st) => {
      const asOf = pickAsOfCondition(st.conditions, sale.date_of_sale);
      return {
        key: `${sale.sale_id}-${st.id}`,
        parcelId: st.parcel_id,

        condition: asOf?.condition ?? "—",
        saleDate: fmtDate(sale.date_of_sale),
        salePrice: fmtUSD(sale.net_selling_price),
        saleType: sale.test_sales_sale_typesCollection
          ? (unwrapEdges(sale.test_sales_sale_typesCollection.edges)
              .sort((a, b) =>
                (b.effective_date ?? "").localeCompare(a.effective_date ?? "")
              )
              .map((t) => t.test_sale_types.sale_type)[0] ?? "—")
          : "—",
      };
    })
  );

  if (cards.length === 0) {
    return <div className="rounded border p-4 text-gray-600">No results.</div>;
  }

  cards.sort((a, b) => {
    const da = new Date(a.saleDate).getTime() || 0;
    const db = new Date(b.saleDate).getTime() || 0;
    return db - da;
  });

  return (
    <div
      className={`grid grid-cols-1 ${
        cards.length % 2 === 0 ? "md:grid-cols-2" : "md:grid-cols-1"
      } gap-4`}
    >
      {cards.map((c) => (
        <div
          key={c.key}
          className="rounded border overflow-hidden shadow-sm hover:shadow transition-shadow"
        >
          {/* Content */}
          <div className="p-3 space-y-2">
            <div className="grid grid-cols-1 gap-x-4 gap-y-1 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Condition</span>
                <span className="font-medium">{c.condition}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">Sale Type</div>
              <div className="font-medium text-sm">{c.saleType}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">Sale Date</div>
              <div className="font-medium text-sm">{c.saleDate}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">Sale Price</div>
              <div className="font-medium text-sm">{c.salePrice}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
