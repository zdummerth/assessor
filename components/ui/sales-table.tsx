import { getFilteredData, UpdatedFilters } from "@/lib/data";
import { SetUrlParam } from "@/components/ui/filter-client";

const formatParcelId = (parcelId: number) => {
  const formattedParcelId = parcelId.toString().padStart(11, "0");
  return `${formattedParcelId.slice(0, 4)}-${formattedParcelId.slice(4, 5)}-${formattedParcelId.slice(5, 8)}.${formattedParcelId.slice(8)}`;
};

export default async function SalesTable({
  filters,
  currentPage,
  sort = "document_number+asc",
}: {
  filters: UpdatedFilters;
  currentPage: number;
  sort?: string;
}) {
  // Extract the keys to pass to the getFilteredData function
  const sortColumn = sort.split("+")[0];
  const sortDirection = sort.split("+")[1];

  const { data, error } = await getFilteredData({
    filters,
    currentPage,
    selectString:
      "document_number, date_of_sale, net_selling_price, sale_type, appraiser, parcels(asrparcelid, asdtotal)",
    table: "sales",
    sortColumn,
    sortDirection,
  });

  if (!data) {
    console.error(error);
    return <div>Failed to fetch data</div>;
  }

  const formattedColumns = [
    { key: "document_number", label: "Document Number" },
    { key: "date_of_sale", label: "Date of Sale" },
    { key: "net_selling_price", label: "Net Selling Price" },
    { key: "sale_type", label: "Sale Type" },
    { key: "appraiser", label: "Appraiser" },
  ];

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg p-2 md:pt-0">
          {/* Mobile view */}
          {/* <div className="md:hidden">
            {data?.map((sale: any) => (
              <div
                key={sale.document_number}
                className="mb-2 w-full rounded-md p-4"
              >
                <div className="flex items-center justify-between border-b border-foreground pb-4">
                  {formattedColumns.map((column) => (
                    <div key={column.key} className="mb-2">
                      <p>{sale[column.key]}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div> */}

          {/* Table view */}
          <table className="hidden min-w-full md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Parcel
                </th>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Assessed
                </th>
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
                  key={sale.document_number}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap px-3 py-3">
                    {sale.parcels.map((parcel: any) => (
                      <p key={parcel.asrparcelid}>
                        {formatParcelId(parcel.asrparcelid)}
                      </p>
                    ))}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {sale.parcels.map((parcel: any) => (
                      <p key={parcel.asrparcelid}>{parcel.asdtotal}</p>
                    ))}
                  </td>
                  {formattedColumns.map((column) => (
                    <td
                      key={column.key}
                      className="whitespace-nowrap px-3 py-3"
                    >
                      {sale[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
