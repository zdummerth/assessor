import ComboboxComponent from "@/components/ui/combobox";
import { getCodes, getNeighborhoods } from "@/lib/data";

export type ComboboxValue = {
  id: string;
  name: string;
};

export default async function Filter({
  urlParam,
  label,
}: {
  urlParam: string;
  label: string;
}) {
  const map: any = {
    landuse: "land_use_codes",
    cda: "cda_codes",
    tif: "tif_district_codes",
    specBusDist: "spec_bus_dist_codes",
    nbrhdcode: "neighborhood_code",
  };

  const codeTable = map[urlParam];

  if (!codeTable) {
    throw new Error("Invalid URL param");
  }

  const codes = await getCodes(codeTable);
  const values: ComboboxValue[] = codes.map((code) => ({
    id: code.code,
    name: `${code.code} - ${code.name}`,
  }));

  return (
    <>
      <h4 className="mb-4">{label}</h4>
      <ComboboxComponent values={values} urlParam={urlParam} />
    </>
  );
}

export async function NeighborhoodFilter({
  urlParam,
  label,
}: {
  urlParam: string;
  label: string;
}) {
  const neighborhoods = await getNeighborhoods();
  const values: ComboboxValue[] = neighborhoods.map((n) => ({
    id: n.neighborhood,
    name: n.neighborhood,
  }));

  return (
    <div className="relative">
      <h4 className="mb-4">{label}</h4>
      <ComboboxComponent
        values={values}
        urlParam={urlParam}
        immediate={false}
      />
    </div>
  );
}
