import { getCodes, getFilteredStats } from "@/lib/data";
import ComboboxComponent from "@/components/ui/combobox";
// import AssessedReport from "@/components/ui/assessed-report";

export default async function Page({
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

  const landUseValues = landUseCodes.map((code) => ({
    id: code.code,
    name: `${code.code} - ${code.name}`,
  }));

  const cdaValues = cdaCodes.map((code) => ({
    id: code.code,
    name: `${code.code} - ${code.name}`,
  }));

  const stats = await getFilteredStats(formattedSearchParams);
  console.log("stats", stats);
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
        </div>
        <div className="w-full">
          <h2 className="font-bold text-2xl mb-4">Statistics</h2>
          {/* <AssessedReport stats={stats[0]} /> */}
        </div>
      </div>
    </div>
  );
}
