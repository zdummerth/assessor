"use client";

import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { useState } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { get } from "http";

type Value = {
  id: number;
  name: string;
};

export default function ComboboxComponent({
  values,
  urlParam,
}: {
  values: Value[];
  urlParam: string;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [query, setQuery] = useState("");

  function handleFilterChange(values: Value[]) {
    const params = new URLSearchParams(searchParams);
    console.log("values", values);
    const ids = values.map((value) => value.id);
    console.log("ids", ids);
    const joined = ids.join("+");
    console.log("joined", joined);

    if (values.length > 0) {
      params.set(urlParam, ids.join("+")); // Join multiple values with a "+"
    } else {
      params.delete(urlParam); // Remove the parameter if no value is selected
    }

    setQuery("");
    replace(`${pathname}?${params.toString()}`);
  }

  function getSelectedValues(name: string): Value[] {
    const param = searchParams.get(name);
    const ids = param ? param.split("+") : [];
    const selectedValues = values.filter((value) =>
      ids.includes(value.id.toString())
    );
    return selectedValues;
  }

  const selectedValues = getSelectedValues(urlParam);
  console.log("selectedValues", selectedValues);

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams);
    params.delete(urlParam);
    replace(`${pathname}?${params.toString()}`);
  };

  const notSelectedValues = values.filter((value) => {
    const ids = selectedValues.map((value) => value.id);
    return !ids.includes(value.id);
  });

  const filteredValues =
    query === ""
      ? notSelectedValues
      : notSelectedValues.filter((value) => {
          return value.name.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <Combobox
      multiple
      immediate
      value={selectedValues}
      // @ts-ignore
      onChange={handleFilterChange}
      onClose={() => setQuery("")}
    >
      {selectedValues.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {selectedValues.map((value: Value) => (
            <li className="rounded bg-blue-200 p-2" key={value.id}>
              <span className="mr-2">{value.name}</span>
              <button
                onClick={() => {
                  handleFilterChange(
                    selectedValues.filter((v) => v.id !== value.id)
                  );
                }}
              >
                X
              </button>
            </li>
          ))}
        </ul>
      )}
      <ComboboxInput
        aria-label="Assignees"
        onChange={(event) => setQuery(event.target.value)}
        value={query}
      />
      <ComboboxOptions anchor="bottom" className="border empty:invisible">
        {filteredValues.map((value) => (
          <ComboboxOption
            key={value.id}
            value={value}
            className="data-[focus]:bg-blue-100"
          >
            {value.name}
          </ComboboxOption>
        ))}
      </ComboboxOptions>
      <button onClick={clearFilters}>Clear Filters</button>
    </Combobox>
  );
}
