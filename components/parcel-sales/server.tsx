// app/components/SalesWithStructuresCardsServer.tsx
import { createClient } from "@/utils/supabase/server";
import graphql from "@/utils/supabase/graphql";
import ClientSalesWithStructuresCards from "./client";

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

type Section = {
  id: number;
  type: string;
  finished_area: number | null;
  unfinished_area: number | null;
};

type Structure = {
  id: number;
  year_built: number | null;
  full_bathrooms: number | null;
  half_bathrooms: number | null;
  test_conditionsCollection?: { edges: GQLEdge<Condition>[] };
  test_structure_sectionsCollection?: { edges: GQLEdge<Section>[] };
};

type ParcelStructureLink = {
  parcel_id: number;
  structure_id: number;
  effective_date: string | null; // ISO
  end_date: string | null; // ISO or null
  test_structures: Structure;
};

function unwrapEdges<T>(edges?: GQLEdge<T>[]) {
  return (edges ?? []).map((e) => e.node);
}

function pickAsOfCondition(conds: Condition[], onISO: string) {
  const on = new Date(onISO);
  const candidates = conds
    .filter((c) => {
      const ed = new Date(c.effective_date);
      return !isNaN(+ed) && ed <= on;
    })
    .sort((a, b) => +new Date(b.effective_date) - +new Date(a.effective_date));
  return candidates[0] ?? null;
}

function linkActiveOn(link: ParcelStructureLink, onISO: string) {
  const on = new Date(onISO);
  const eff = link.effective_date ? new Date(link.effective_date) : null;
  const end = link.end_date ? new Date(link.end_date) : null;
  if (eff && on < eff) return false;
  if (end && !(on < end)) return false; // end is exclusive
  return true;
}

export default async function SalesWithStructuresCardsServer({
  parcelId,
}: {
  parcelId: number;
}) {
  const supabase = await createClient();

  // Pull parcel sales and structure links (with structures, conditions, sections)
  const query = /* GraphQL */ `
    query GetParcelSalesAndStructures($parcelId: BigInt!) {
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

      test_parcel_structuresCollection(
        filter: { parcel_id: { eq: $parcelId } }
      ) {
        edges {
          node {
            parcel_id
            structure_id
            effective_date
            end_date
            test_structures {
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
              test_structure_sectionsCollection {
                edges {
                  node {
                    id
                    type
                    finished_area
                    unfinished_area
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const res = await graphql(query, { parcelId }, supabase);

  // Sales
  const sales: Sale[] = (res?.data?.test_parcel_salesCollection?.edges ?? [])
    .map((e: any) => e.node?.test_sales ?? [])
    .flat();

  // Structure links (with nested structure + conditions + sections)
  const structLinks: ParcelStructureLink[] = (
    res?.data?.test_parcel_structuresCollection?.edges ?? []
  )
    .map((e: any) => e.node)
    .filter((n: any) => n?.test_structures);

  // Build per-sale summaries with structure details active on that sale date
  const cards = sales.map((sale) => {
    const saleType = sale.test_sales_sale_typesCollection
      ? (unwrapEdges(sale.test_sales_sale_typesCollection.edges)
          .sort((a, b) =>
            (b.effective_date ?? "").localeCompare(a.effective_date ?? "")
          )
          .map((t) => t.test_sale_types.sale_type)[0] ?? "—")
      : "—";

    const active = structLinks.filter((lnk) =>
      linkActiveOn(lnk, sale.date_of_sale)
    );

    const structures = active.map((lnk) => {
      const st = lnk.test_structures;
      const conds = unwrapEdges<Condition>(st.test_conditionsCollection?.edges);
      const secs = unwrapEdges<Section>(
        st.test_structure_sectionsCollection?.edges
      );

      const asOf = pickAsOfCondition(conds, sale.date_of_sale);

      const finished = secs.reduce((a, s) => a + (s.finished_area ?? 0), 0);
      const unfinished = secs.reduce((a, s) => a + (s.unfinished_area ?? 0), 0);

      return {
        id: st.id,
        year_built: st.year_built,
        full_bathrooms: st.full_bathrooms,
        half_bathrooms: st.half_bathrooms,
        condition: asOf?.condition ?? "—",
        condition_effective_date: asOf?.effective_date ?? null,
        sections: secs.map((s) => ({
          id: s.id,
          type: s.type,
          finished_area: s.finished_area ?? 0,
          unfinished_area: s.unfinished_area ?? 0,
          total_area: (s.finished_area ?? 0) + (s.unfinished_area ?? 0),
        })),
        totals: {
          finished_area: finished,
          unfinished_area: unfinished,
          total_area: finished + unfinished,
        },
        _link_effective_date: lnk.effective_date,
        _link_end_date: lnk.end_date,
      };
    });

    const summary = {
      building_count: structures.length,
      finished_area: structures.reduce((a, s) => a + s.totals.finished_area, 0),
      unfinished_area: structures.reduce(
        (a, s) => a + s.totals.unfinished_area,
        0
      ),
      total_area: structures.reduce((a, s) => a + s.totals.total_area, 0),
    };

    return {
      key: sale.sale_id,
      sale_id: sale.sale_id,
      sale_date: sale.date_of_sale,
      sale_price: sale.net_selling_price,
      sale_type: saleType ?? "—",
      summary,
      structures,
    };
  });

  // Sort by newest sale first
  cards.sort((a, b) => +new Date(b.sale_date) - +new Date(a.sale_date));

  return <ClientSalesWithStructuresCards cards={cards} />;
}
