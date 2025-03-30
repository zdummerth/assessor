import { getFilteredData, ParcelYearFilters } from "@/lib/data";
import { SetUrlParam } from "@/components/ui/filter-client";

export default async function SalesTable({
  filters,
  currentPage,
  sort = "date_of_sale+asc",
}: {
  filters: ParcelYearFilters;
  currentPage: number;
  sort?: string;
}) {
  const sortColumn = sort.split("+")[0];
  const sortDirection = sort.split("+")[1];

  const { data, error } = await getFilteredData({
    filters,
    currentPage,
    table: "get_sales_by_parcel_data",
    sortColumn,
    sortDirection,
  });

  if (!data) {
    console.error(error);
    return <div>Failed to fetch data</div>;
  }

  const formattedColumns = [
    { key: "parcel_number", label: "Parcel" },
    { key: "date_of_sale", label: "Date of Sale" },
    { key: "net_selling_price", label: "Net Selling Price" },
    { key: "sale_type", label: "Sale Type" },
    { key: "document_number", label: "Document Number" },
  ];

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg p-2 md:pt-0">
          {/* Table view for larger screens */}
          <table className="hidden min-w-full md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                {formattedColumns.map((column) => (
                  <th
                    key={column.key}
                    scope="col"
                    className="px-4 py-5 font-medium sm:pl-6"
                  >
                    <SetUrlParam
                      urlParam="sort"
                      value={{
                        id: `${column.key}+${sortDirection === "asc" ? "desc" : "asc"}`,
                        label: column.label,
                      }}
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((sale: any) => (
                <tr
                  key={sale.id}
                  className="border-b py-3 text-sm last-of-type:border-none"
                >
                  {formattedColumns.map((column) =>
                    column.key === "parcel_number" ? (
                      <td
                        key={`${sale.id}-${column.key}`}
                        className="whitespace-nowrap px-3 py-3"
                      >
                        <a
                          href={`/parcels/${sale.parcel_number}`}
                          className="text-blue-500 hover:underline"
                          target="_blank"
                        >
                          {sale.parcel_number}
                        </a>
                      </td>
                    ) : (
                      <td
                        key={`${sale.id}-${column.key}`}
                        className="whitespace-nowrap px-3 py-3"
                      >
                        {sale[column.key]}
                      </td>
                    )
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Card view for mobile screens */}
          <div className="md:hidden">
            {data.map((sale: any) => (
              <div
                key={sale.id}
                className="mb-4 rounded-lg border p-4 shadow-sm"
              >
                {formattedColumns.map((column) => (
                  <div
                    key={`${sale.id}-${column.key}`}
                    className="mb-2 text-sm"
                  >
                    <span className="font-medium">{column.label}: </span>
                    {column.key === "parcel_number" ? (
                      <a
                        href={`/parcels/${sale.parcel_number}`}
                        className="text-blue-500 hover:underline"
                        target="_blank"
                      >
                        {sale.parcel_number}
                      </a>
                    ) : (
                      <span>{sale[column.key]}</span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
