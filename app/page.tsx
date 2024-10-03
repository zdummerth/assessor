import { getCodes, getFilteredStats } from "@/lib/data";
import ComboboxComponent from "@/components/ui/combobox";
import AssessedReport from "@/components/ui/assessed-report";

export default async function ProtectedPage({
  searchParams,
}: {
  searchParams?: {
    landuse?: string;
    cda?: string;
    tif?: string;
  };
}) {
  const formattedSearchParams = Object.fromEntries(
    Object.entries(searchParams ? searchParams : {}).map(([key, value]) => [
      key,
      value.split("+"),
    ])
  );

  const landUseCodes = await getCodes("land_use_codes");
  const cdaCodes = await getCodes("cda_codes");
  const tifCodes = await getCodes("tif_disticts");

  const landUseValues = landUseCodes.map((code) => ({
    id: code.code,
    name: `${code.code} - ${code.name}`,
  }));

  const cdaValues = cdaCodes.map((code) => ({
    id: code.code,
    name: `${code.code} - ${code.name}`,
  }));

  const tifValues = tifCodes.map((code) => ({
    id: code.code,
    name: `${code.code} - ${code.name}`,
  }));

  const stats = await getFilteredStats(formattedSearchParams);
  if (!stats) {
    return <div>Failed to fetch data</div>;
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full flex gap-4">
        <div className="w-[500px] pr-2 border-r border-forground overflow-x-hidden">
          <div className="border-b border-foreground py-8">
            <h4 className="mb-4">Occupancy</h4>
            <ComboboxComponent values={landUseValues} urlParam="landuse" />
          </div>
          <div className="border-b border-foreground py-8">
            <h4 className="mb-4">CDA Neighborhood</h4>
            <ComboboxComponent values={cdaValues} urlParam="cda" />
          </div>
          <div className="border-b border-foreground pb-4">
            <h2 className="font-bold text-2xl mb-4">Filter Instructions</h2>
            <ul className="list-disc list-inside mt-4">
              <li>
                To select a filter, search for the desired value in the search
                bar.
              </li>
              <li>Selected filters will be displayed in blue.</li>
              <li>To remove a filter, click the blue selected filter.</li>
              <li>
                Ex. If 1110 and 1120 are selected for occupancy and Shaw is
                selected for neighborhood, it will return stats for parcels that
                are either 1120 or 1130 in Shaw.
              </li>
              <li>
                Ex. If 1110 and 1120 are selected for occupancy and Shaw and
                Boulevard Heights are selected for neighborhood, it will return
                stats for parcels that are either 1110 or 1120 in Shaw or
                Boulevard Heights.
              </li>
              <li>If no filters are selected, all parcels will be returned.</li>
            </ul>
          </div>
        </div>
        <div className="w-full">
          <h2 className="font-bold text-2xl mb-4">Statistics</h2>
          <AssessedReport stats={stats[0]} />
        </div>
      </div>
    </div>
  );
}
