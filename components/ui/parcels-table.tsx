import { getFilteredData, UpdatedFilters } from "@/lib/data";

export default async function ParcelsTable({
  filters,
  currentPage,
}: {
  filters: UpdatedFilters;
  currentPage: number;
}) {
  const { data, error } = await getFilteredData(
    filters,
    "asrparcelid, lowaddrnum, stname, zip",
    currentPage
  );

  if (!data) {
    console.error(error);
    return <div>Failed to fetch data</div>;
  }

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg p-2 md:pt-0">
          <div className="md:hidden">
            {data?.map((parcel: any) => (
              <div
                key={parcel.asrparcelid}
                className="mb-2 w-full rounded-md p-4"
              >
                <div className="flex items-center justify-between border-b border-foreground pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{parcel.lowaddrnum}</p>
                    </div>
                    <p className="text-sm">{parcel.stname}</p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">{parcel.zip}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    {/* <UpdateInvoice id={parcel.id} /> */}
                    {/* <DeleteInvoice id={parcel.id} /> */}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Parcel ID
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Address
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Street
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Zip
                </th>
              </tr>
            </thead>
            <tbody className="">
              {data.map((parcel: any) => (
                <tr
                  key={parcel.asrparcelid}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{parcel.asrparcelid}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {parcel.lowaddrnum}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {parcel.stname}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">{parcel.zip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
