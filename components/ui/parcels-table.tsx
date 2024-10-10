import { getFilteredData, UpdatedFilters } from "@/lib/data";
import { NonCodedFilter } from "@/components/ui/filter-client";

type Column = {
  label: string;
  key: string;
};

export default async function ParcelsTable({
  filters,
  currentPage,
  columns,
}: {
  filters: UpdatedFilters;
  currentPage: number;
  columns: string[];
}) {
  // Extract the keys to pass to the getFilteredData function
  const columnKeys = ["asrparcelid", ...columns].join(", ");

  const { data, error } = await getFilteredData(
    filters,
    columnKeys,
    currentPage
  );

  if (!data) {
    console.error(error);
    return <div>Failed to fetch data</div>;
  }

  const tableToLabelMap: any = {
    asrlanduse1: "Occupancy",
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
  };

  const formattedColumns = columns.map((columnName) => ({
    key: columnName,
    label: tableToLabelMap[columnName],
  }));

  const defaultColumns = [
    {
      key: "asrparcelid",
      label: "Parcel ID",
    },
    ...formattedColumns,
  ];

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
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
        <div className="rounded-lg p-2 md:pt-0">
          {/* Mobile view */}
          <div className="md:hidden">
            {data?.map((parcel: any) => (
              <div
                key={parcel.asrparcelid}
                className="mb-2 w-full rounded-md p-4"
              >
                <div className="flex items-center justify-between border-b border-foreground pb-4">
                  {defaultColumns.map((column) => (
                    <div key={column.key} className="mb-2">
                      <p>{parcel[column.key]}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Table view */}
          <table className="hidden min-w-full md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                {defaultColumns.map((column) => (
                  <th
                    key={column.key}
                    scope="col"
                    className="px-4 py-5 font-medium sm:pl-6"
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((parcel: any) => (
                <tr
                  key={parcel.asrparcelid}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  {defaultColumns.map((column) => (
                    <td
                      key={column.key}
                      className="whitespace-nowrap px-3 py-3"
                    >
                      {/* Check if parcel[column.key] is boolean*/}
                      {typeof parcel[column.key] === "boolean"
                        ? parcel[column.key]
                          ? "Yes"
                          : "No"
                        : parcel[column.key] === null
                          ? "N/A"
                          : parcel[column.key]}
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
