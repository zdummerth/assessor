import FetchDataSteps from "@/components/tutorial/fetch-data-steps";
import { createClient } from "@/utils/supabase/server";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { getAssessmentStats, getCodes } from "@/lib/data";
import FiltersForm from "@/components/ui/filters";
import ComboboxComponent from "@/components/ui/combobox";
import Autocomplete from "@/components/ui/autocomplete";

const values = [
  { id: 1, name: "Durward Reynolds" },
  { id: 2, name: "Kenton Towne" },
  { id: 3, name: "Therese Wunsch" },
  { id: 4, name: "Benedict Kessler" },
  { id: 5, name: "Katelyn Rohan" },
];

export default async function ProtectedPage() {
  // const supabase = createClient();

  const landUseCodes = await getCodes("land_use_codes");

  const landUseValues = landUseCodes.map((code) => ({
    id: code.code,
    name: `${code.code} - ${code.name}`,
  }));

  // const {
  //   data: { user },
  // } = await supabase.auth.getUser();

  // if (!user) {
  //   return redirect("/sign-in");
  // }

  // const [stats] = await getAssessmentStats({
  //   isabatedproperty: true,
  //   zip: "63116",
  // });

  // if (!stats) {
  //   return <div>Failed to fetch data</div>;
  // }

  // console.log("stats from server", stats);

  // List of metrics to display
  // const metrics = [
  //   { label: "Total Assessed", value: stats.total_asdtotal.toLocaleString() },
  //   { label: "Max Assessed", value: stats.max_asdtotal.toLocaleString() },
  //   {
  //     label: "Average Assessed",
  //     value: Math.round(stats.avg_asdtotal).toLocaleString(),
  //   },
  //   { label: "Median Assessed", value: stats.median_asdtotal.toLocaleString() },
  //   { label: "Number of Parcels", value: stats.count_asdtotal },
  // ];

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full">
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          This is a protected page that you can only see as an authenticated
          user
        </div>
      </div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-3 w-full pr-2 border-r border-forground overflow-x-hidden">
          {/* <FiltersForm /> */}
          <div className="border-b border-foreground py-8">
            <h4 className="mb-4">Land Use</h4>
            <ComboboxComponent values={landUseValues} urlParam="landuse" />
          </div>
          {/* <ComboboxComponent values={values} urlParam="user" /> */}
          {/* <Autocomplete /> */}
        </div>
        {/* <div className="col-span-9">
          <h2 className="font-bold text-2xl mb-4">Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="p-4 rounded-lg shadow-foreground shadow-sm flex flex-col items-center justify-center"
              >
                <h3 className="text-lg font-semibold mb-2">{metric.label}</h3>
                <p className="text-2xl font-bold">{metric.value ?? "N/A"}</p>
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </div>
  );
}
