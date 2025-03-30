import { getFilteredData, ParcelYearFilters, getAggregates } from "@/lib/data";

export async function ValueCard({ filters }: { filters: ParcelYearFilters }) {
  console.log("filters", filters);
  const { data, error }: any = await getFilteredData({
    filters,
    selectString: `count:parcel_number.count(),
    res_land_value:appraised_res_land.sum(),
    res_building_value:appraised_res_building.sum(),
    res_new_construction_value:appraised_res_new_construction.sum(),
    com_land_value:appraised_com_land.sum(),
    com_building_value:appraised_com_building.sum(),
    com_new_construction_value:appraised_com_new_construction.sum(),
    agr_land_value:appraised_agr_land.sum(),
    agr_building_value:appraised_agr_building.sum(),
    agr_new_construction_value:appraised_agr_new_construction.sum()
    `,
    table: "parcel_year",
  });

  if (!data) {
    console.log(error);
    return <div>Failed to fetch data</div>;
  }

  // replace null values with 0
  for (const key of Object.keys(data[0])) {
    if (data[0][key] === null) {
      data[0][key] = 0;
    }
  }

  console.log(data);

  return (
    <div className="p-4 rounded-lg shadow-foreground shadow-sm">
      <div className="flex flex-wrap gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-2">Number of Parcels</h3>
          <p className="text-2xl font-bold">{data[0].count.toLocaleString()}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Residential Land Value</h3>
          <p className="text-2xl font-bold">
            ${data[0].res_land_value.toLocaleString()}
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">
            Residential Improvement Value
          </h3>
          <p className="text-2xl font-bold">
            ${data[0].res_building_value.toLocaleString()}
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Commercial Land Value</h3>
          <p className="text-2xl font-bold">
            ${data[0].com_land_value.toLocaleString()}
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">
            Commercial Improvement Value
          </h3>
          <p className="text-2xl font-bold">
            ${data[0].com_building_value.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}

export async function CondoReportCard({
  filters,
}: {
  filters: ParcelYearFilters;
}) {
  if (filters.occupancy) {
    return <div></div>;
  }
  const newFilters = {
    ...filters,
    occupancy: ["1114", "1115"],
  };

  const { data, error }: any = await getFilteredData({
    filters: newFilters,
    selectString: `count:asrparcelid.count(), 
    total_units:nbrofunits.sum(), 
    res_land_value:aprresland.sum(), 
    res_improvement_value:aprresimprove.sum(),
    com_land_value:aprcomland.sum(),
    com_improvement_value:aprcomimprove.sum(),
    total_asd_value:asdtotal.sum()
    `,
  });

  if (!data) {
    console.log(error);
    return <div>Failed to fetch data</div>;
  }

  for (const key of Object.keys(data[0])) {
    if (data[0][key] === null) {
      data[0][key] = 0;
    }
  }

  return (
    <div className="p-4 rounded-lg shadow-foreground shadow-sm">
      <h4 className="text-3xl">Condominiums</h4>
      <div className="flex flex-wrap gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-2">Number of Parcels</h3>
          <p className="text-2xl font-bold">{data[0].count.toLocaleString()}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Total Units</h3>
          <p className="text-2xl font-bold">
            {data[0].total_units.toLocaleString()}
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Residential Land Value</h3>
          <p className="text-2xl font-bold">
            ${data[0].res_land_value.toLocaleString()}
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">
            Residential Improvement Value
          </h3>
          <p className="text-2xl font-bold">
            ${data[0].res_improvement_value.toLocaleString()}
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Commercial Land Value</h3>
          <p className="text-2xl font-bold">
            ${data[0].com_land_value.toLocaleString()}
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">
            Commercial Improvement Value
          </h3>
          <p className="text-2xl font-bold">
            ${data[0].com_improvement_value.toLocaleString()}
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Total Assessed Value</h3>
          <p className="text-2xl font-bold">
            ${data[0].total_asd_value.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}

export async function CommercialReportCard({
  filters,
}: {
  filters: ParcelYearFilters;
}) {
  const newFilters = {
    ...filters,
    isCommercial: true,
  };

  const { data, error }: any = await getFilteredData({
    filters: newFilters,
    selectString: `count:asrparcelid.count(), 
    com_land_value:aprcomland.sum(),
    com_improvement_value:aprcomimprove.sum(),
    total_asd_value:asdtotal.sum()
    `,
  });

  if (!data) {
    console.log(error);
    return <div>Failed to fetch data</div>;
  }

  for (const key of Object.keys(data[0])) {
    if (data[0][key] === null) {
      data[0][key] = 0;
    }
  }

  return (
    <div className="p-4 rounded-lg shadow-foreground shadow-sm">
      <h4 className="text-3xl">Commercial</h4>
      <div className="flex flex-wrap gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-2">Number of Parcels</h3>
          <p className="text-2xl font-bold">{data[0].count.toLocaleString()}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Land Value</h3>
          <p className="text-2xl font-bold">
            ${data[0].com_land_value.toLocaleString()}
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Improvement Value</h3>
          <p className="text-2xl font-bold">
            ${data[0].com_improvement_value.toLocaleString()}
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Total Assessed Value</h3>
          <p className="text-2xl font-bold">
            ${data[0].total_asd_value.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}

export async function ResidentialReportCard({
  filters,
}: {
  filters: ParcelYearFilters;
}) {
  const newFilters = {
    ...filters,
    isResidential: true,
  };

  const { data, error }: any = await getFilteredData({
    filters: newFilters,
    selectString: `count:asrparcelid.count(), 
    res_land_value:aprresland.sum(),
    res_improvement_value:aprresimprove.sum(),
    total_asd_value:asdtotal.sum()
    `,
  });

  if (!data) {
    console.log(error);
    return <div>Failed to fetch data</div>;
  }

  for (const key of Object.keys(data[0])) {
    if (data[0][key] === null) {
      data[0][key] = 0;
    }
  }

  return (
    <div className="p-4 rounded-lg shadow-foreground shadow-sm">
      <h4 className="text-3xl">Residential</h4>
      <div className="flex flex-wrap gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-2">Number of Parcels</h3>
          <p className="text-2xl font-bold">{data[0].count.toLocaleString()}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Land Value</h3>
          <p className="text-2xl font-bold">
            ${data[0].res_land_value.toLocaleString()}
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Improvement Value</h3>
          <p className="text-2xl font-bold">
            ${data[0].res_improvement_value.toLocaleString()}
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Total Assessed Value</h3>
          <p className="text-2xl font-bold">
            ${data[0].total_asd_value.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}

export async function MixedUseReportCard({
  filters,
}: {
  filters: ParcelYearFilters;
}) {
  const newFilters = {
    ...filters,
    isMixedUse: true,
  };

  const { data, error }: any = await getFilteredData({
    filters: newFilters,
    selectString: `count:asrparcelid.count(), 
    res_land_value:aprresland.sum(),
    res_improvement_value:aprresimprove.sum(),
    total_asd_value:asdtotal.sum()
    `,
  });

  if (!data) {
    console.log(error);
    return <div>Failed to fetch data</div>;
  }

  for (const key of Object.keys(data[0])) {
    if (data[0][key] === null) {
      data[0][key] = 0;
    }
  }

  return (
    <div className="p-4 rounded-lg shadow-foreground shadow-sm">
      <h4 className="text-3xl">Residential</h4>
      <div className="flex flex-wrap gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-2">Number of Parcels</h3>
          <p className="text-2xl font-bold">{data[0].count.toLocaleString()}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Land Value</h3>
          <p className="text-2xl font-bold">
            ${data[0].res_land_value.toLocaleString()}
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Improvement Value</h3>
          <p className="text-2xl font-bold">
            ${data[0].res_improvement_value.toLocaleString()}
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Total Assessed Value</h3>
          <p className="text-2xl font-bold">
            ${data[0].total_asd_value.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}

export async function GroupedReportCard({
  filters,
  groupBy,
}: {
  filters: ParcelYearFilters;
  groupBy: string;
}) {
  const { data, error }: any = await getFilteredData({
    filters,
    selectString: `
    group:${groupBy},
    count:asrparcelid.count(), 
    res_land_value:aprresland.sum(),
    res_improvement_value:aprresimprove.sum(),
    total_asd_value:asdtotal.sum()
    `,
  });

  if (!data) {
    console.log(error);
    return <div>Failed to fetch data</div>;
  }

  // console.log(data[0]);

  for (const key of Object.keys(data[0])) {
    if (data[0][key] === null) {
      data[0][key] = 0;
    }
  }

  return (
    <div className="p-4 rounded-lg shadow-foreground shadow-sm">
      <h3>{`Breakdown by ${groupBy}`}</h3>
      {data
        .sort((a: any, b: any) => a.group - b.group)
        .map((group: any) => (
          <div key={group.group} className="border-b border-foreground py-4">
            <h4 className="text-3xl">{group.group}</h4>
            <div className="flex flex-wrap gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Number of Parcels
                </h3>
                <p className="text-2xl font-bold">
                  {group.count.toLocaleString()}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Land Value</h3>
                <p className="text-2xl font-bold">
                  ${group.res_land_value.toLocaleString()}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Improvement Value
                </h3>
                <p className="text-2xl font-bold">
                  ${group.res_improvement_value.toLocaleString()}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Total Assessed Value
                </h3>
                <p className="text-2xl font-bold">
                  ${group.total_asd_value.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
