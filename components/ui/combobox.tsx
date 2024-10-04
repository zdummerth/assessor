"use client";

import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

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
    const ids = values.map((value) => value.id);

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
      //   immediate
      value={selectedValues}
      // @ts-ignore
      onChange={handleFilterChange}
      onClose={() => setQuery("")}
    >
      <div className="flex items-center">
        <SearchIcon size="16" strokeWidth={2} />
        <ComboboxInput
          aria-label="Assignees"
          onChange={(event) => setQuery(event.target.value)}
          value={query}
          className="bg-gray-200 dark:bg-gray-800"
        />
      </div>
      {selectedValues.length > 0 && (
        <ul className="flex flex-wrap gap-2 mt-4 w-[var(--input-width)] overflow-hidden">
          {selectedValues.map((value: Value) => (
            <li
              className="rounded-full bg-blue-400 py-[1px] px-2 text-sm truncate hover:overflow-visible hover:whitespace-normal"
              key={value.id}
            >
              <button
                onClick={() => {
                  handleFilterChange(
                    selectedValues.filter((v) => v.id !== value.id)
                  );
                }}
              >
                {value.name}
              </button>
            </li>
          ))}
        </ul>
      )}
      <ComboboxOptions
        anchor="top"
        className="border empty:invisible w-[var(--input-width)] max-h-[250px] bg-accent text-foreground"
      >
        {filteredValues.map((value) => (
          <ComboboxOption
            key={value.id}
            value={value}
            className="data-[focus]:bg-blue-500 border-b border-foreground py-2 px-4"
          >
            {value.name}
          </ComboboxOption>
        ))}
      </ComboboxOptions>
      {/* <button onClick={clearFilters}>Clear Filters</button> */}
    </Combobox>
  );
}
