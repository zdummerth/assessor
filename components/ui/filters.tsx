"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";

export default function FiltersForm() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const filters = [
    { name: "zip", label: "ZIP Code" },
    { name: "asrclasscode", label: "AsrClassCode" },
    { name: "asrlanduse1", label: "AsrLandUse1" },
    { name: "isabatedproperty", label: "Is Abated Property" },
    { name: "abatementtype", label: "Abatement Type" },
    { name: "abatementstartyear", label: "Abatement Start Year" },
    { name: "abatementendyear", label: "Abatement End Year" },
    { name: "specbusdist", label: "Special Business District" },
    { name: "tifdist", label: "TIF District" },
    { name: "zoning", label: "Zoning" },
    { name: "nbrhd", label: "Neighborhood" },
    { name: "asrnbrhd", label: "AsrNbrhd" },
  ];

  function handleFilterChange(name: string, values: string[]) {
    const params = new URLSearchParams(searchParams);
    console.log("values", values);
    console.log("name", name);

    if (values.length > 0) {
      params.set(name, values.join("+")); // Join multiple values with a "+"
    } else {
      params.delete(name); // Remove the parameter if no value is selected
    }

    replace(`${pathname}?${params.toString()}`);
  }

  function getDefaultValues(name: string): string[] {
    const param = searchParams.get(name);
    return param ? param.split("+") : [];
  }

  return (
    <form className="flex flex-col gap-4">
      {filters.map((filter) => (
        <div key={filter.name} className="flex flex-col">
          <Label htmlFor={filter.name}>{filter.label}</Label>
          <select
            id={filter.name}
            multiple
            value={getDefaultValues(filter.name)}
            onChange={(e) => {
              const selectedValues = Array.from(
                e.target.selectedOptions,
                (option) => option.value
              );
              handleFilterChange(filter.name, selectedValues);
            }}
            className="block w-full mt-1 p-2 border rounded-md"
          >
            {/* Replace these options with dynamic values if necessary */}
            <option value="Option1">Option 1</option>
            <option value="Option2">Option 2</option>
            <option value="Option3">Option 3</option>
          </select>
        </div>
      ))}
    </form>
  );
}
