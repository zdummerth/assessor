import ComboboxComponent from "@/components/ui/combobox";
import { getCodes } from "@/lib/data";

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
    tif: "tif_codes",
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
