import Link from "next/link";
import { getFilteredData, UpdatedFilters } from "@/lib/data";
import { NonCodedFilter, SetUrlParam } from "@/components/ui/filter-client";

export default async function ParcelsTable({
  filters,
  currentPage,
  columns,
  sort = "parcel_number+asc",
}: {
  filters: UpdatedFilters;
  currentPage: number;
  columns: string[];
  sort?: string;
}) {
  // Extract the keys to pass to the getFilteredData function
  const columnKeys = ["parcel_number", ...columns].join(", ");
  const sortColumn = sort.split("+")[0];
  const sortDirection = sort.split("+")[1];

  const { data, error } = await getFilteredData({
    filters,
    selectString: columnKeys,
    currentPage,
    sortColumn,
    sortDirection,
  });

  if (!data) {
    console.error(error);
    return <div>Failed to fetch data</div>;
  }

  const tableToLabelMap: any = {
    occupancy: "Occupancy",
    site_address_1: "Address",
    nbrhd: "CDA Neighborhood",
    asrnbrhd: "Assessor Neighborhood",
    ward20: "Ward",
    tifdist: "TIF",
    isabatedproperty: "Abated",
    asdtotal: "Total Assessed",
    aprland: "Appraised Land",
    aprresimprove: "Appraised Res Improvements",
    aprcomimprove: "Appraised Com Improvements",
    aprcomland: "Appraised Com Land",
    aprresland: "Appraised Res Land",
    apragrimprove: "Appraised Agr Improvements",
    apragrland: "Appraised Agr Land",
    aprexemptimprove: "Appraised Exempt Improvements",
    aprexemptland: "Appraised Exempt Land",
    specbusdist: "SBD/CID",
  };

  const formattedColumns = columns.map((columnName) => ({
    key: columnName,
    label: tableToLabelMap[columnName],
  }));

  const defaultColumns = [
    {
      key: "parcel_number",
      label: "Parcel",
    },
    ...formattedColumns,
  ];

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="flex items-center gap-4 mb-4">
          <NonCodedFilter
            values={
              Object.entries(tableToLabelMap).map(([key, value]) => ({
                id: key,
                name: value,
              })) as any
            }
            label="Add Column"
            urlParam="columns"
            immediate={true}
          />
        </div>

        <div className="rounded-lg p-2 md:pt-0">
          {/* Mobile view - Cards */}
          <div className="md:hidden grid grid-cols-1 gap-4">
            {data?.map((parcel: any) => (
              <div
                key={`${parcel.parcel_number}-${parcel.year}`}
                className="border rounded-md p-4"
              >
                {/* Parcel number as header/link */}
                <div className="mb-2">
                  <h3 className="text-lg font-bold">
                    <Link
                      href={`/parcels/${parcel.parcel_number}`}
                      className="text-blue-600 hover:underline"
                    >
                      {parcel.parcel_number}
                    </Link>
                  </h3>
                </div>
                {/* Render remaining columns */}
                {defaultColumns
                  .filter((column) => column.key !== "parcel_number")
                  .map((column, index) => (
                    <div key={`${column.key}-${index}`} className="mb-2">
                      <span className="font-semibold">{column.label}: </span>
                      <span>
                        {typeof parcel[column.key] === "boolean"
                          ? parcel[column.key]
                            ? "Yes"
                            : "No"
                          : parcel[column.key] === null
                            ? "N/A"
                            : parcel[column.key]}
                      </span>
                    </div>
                  ))}
              </div>
            ))}
          </div>

          {/* Table view */}
          <table className="hidden min-w-full md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                {defaultColumns.map((column, index) => (
                  <th
                    key={`${column.key}-${index}`}
                    scope="col"
                    className="px-4 py-5 font-medium sm:pl-6"
                  >
                    <SetUrlParam
                      urlParam="sort"
                      value={{
                        id: `${column.key}+${
                          sortDirection === "asc" ? "desc" : "asc"
                        }`,
                        label: column.label,
                      }}
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((parcel: any) => (
                <tr
                  key={`${parcel.parcel_number}-${parcel.year}`}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  {defaultColumns.map((column, index) => (
                    <td
                      key={`${parcel.parcel_number}-${parcel.year}-${column.key}-${index}`}
                      className="whitespace-nowrap px-3 py-3"
                    >
                      {column.key === "parcel_number" ? (
                        <Link
                          href={`/parcels/${parcel.parcel_number}`}
                          className="text-blue-600 hover:underline"
                        >
                          {parcel[column.key]}
                        </Link>
                      ) : typeof parcel[column.key] === "boolean" ? (
                        parcel[column.key] ? (
                          "Yes"
                        ) : (
                          "No"
                        )
                      ) : parcel[column.key] === null ? (
                        "N/A"
                      ) : (
                        parcel[column.key]
                      )}
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
