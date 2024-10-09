"use client";
import ComboboxComponent from "@/components/ui/combobox";

import { useSearchParams, usePathname, useRouter } from "next/navigation";

type Value = {
  id: number;
  name: string;
};

export function NonCodedFilter({
  urlParam,
  label,
  values,
}: {
  urlParam: string;
  label: string;
  values: Value[];
}) {
  return (
    <>
      <h4 className="mb-4">{label}</h4>
      <ComboboxComponent values={values} urlParam={urlParam} />
    </>
  );
}

export function BooleanFilter({
  urlParam,
  label,
  value,
}: {
  urlParam: string;
  label: string;
  value: string | undefined;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  function handleFilterChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const value = event.target.value;

    const params = new URLSearchParams(searchParams);

    if (value !== "false") {
      params.set(urlParam, "true");
    } else {
      params.delete(urlParam); // Remove the parameter if false is selected
    }

    replace(`${pathname}?${params.toString()}`);
  }
  return (
    <>
      <h4 className="mb-4">{label}</h4>
      <select
        className="w-full p-2 border border-foreground rounded-md"
        onChange={handleFilterChange}
        value={searchParams.get(urlParam) || "false"}
      >
        <option value="true">True</option>
        <option value="false">False</option>
      </select>
    </>
  );
}
