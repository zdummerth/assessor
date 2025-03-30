"use client";
import ComboboxComponent from "@/components/ui/combobox";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

type Value = {
  id: string;
  name: string;
};

export function NonCodedFilter({
  urlParam,
  label,
  values,
  immediate,
}: {
  urlParam: string;
  label: string;
  values: Value[];
  immediate?: boolean;
}) {
  return (
    <>
      <h4 className="mb-4">{label}</h4>
      <ComboboxComponent
        values={values}
        urlParam={urlParam}
        immediate={immediate}
      />
    </>
  );
}

export function ToggleFilter({
  urlParam,
  children,
}: {
  urlParam: string;
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  function handleToggle() {
    const params = new URLSearchParams(searchParams);
    // Toggle the filter: if it's currently "true", remove it; otherwise, set it to "true"
    if (searchParams.get(urlParam) === "true") {
      params.delete(urlParam);
    } else {
      params.set(urlParam, "true");
    }
    // Reset the page number whenever the filter changes
    params.delete("page");
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <button onClick={handleToggle} className="p-2 border rounded-md">
      {children}
    </button>
  );
}

export function BooleanFilter({
  urlParam,
  label,
}: {
  urlParam: string;
  label: string;
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

    params.delete("page"); // Reset the page number when a filter is changed
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

type SelectValue = {
  value: string;
  label: string;
  selected?: boolean;
};

export function SelectFilter({
  urlParam,
  label,
  values,
  defaultValue,
}: {
  urlParam: string;
  label?: string;
  values: SelectValue[];
  defaultValue?: string;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [selectedValue, setSelectedValue] = useState(defaultValue);

  useEffect(() => {
    setSelectedValue(searchParams.get(urlParam) || defaultValue);
  }, [searchParams.get(urlParam)]);

  function handleFilterChange(value: string) {
    const params = new URLSearchParams(searchParams);
    if (value !== "") {
      params.set(urlParam, value);
    } else {
      params.delete(urlParam); // Remove the parameter if no value is selected
    }
    params.delete("page");
    setSelectedValue(value);
    replace(`${pathname}?${params.toString()}`);
    // window.history.pushState(null, "", `?${params.toString()}`);
  }

  return (
    <>
      {label && <h4 className="mb-4">{label}</h4>}
      <select
        className="w-full px-2 py-[2px] border border-foreground bg-background rounded-md"
        onChange={(e) => handleFilterChange(e.target.value)}
        // defaultValue={defaultValue}
        value={selectedValue}
      >
        {values.map((value) => (
          <option key={value.value} value={value.value}>
            {value.label}
          </option>
        ))}
      </select>
    </>
  );
}

export function YearSelectFilter({ defaultValue }: { defaultValue: string }) {
  return (
    <SelectFilter
      values={[
        { value: "2020", label: "2020" },
        { value: "2021", label: "2021" },
        { value: "2022", label: "2022" },
        { value: "2023", label: "2023" },
        { value: "2024", label: "2024" },
        { value: "2025", label: "2025" },
      ]}
      urlParam="year"
      defaultValue={defaultValue}
    />
  );
}

export function SetUrlParam({
  urlParam,
  value,
  className = "",
}: {
  urlParam: string;
  className?: string;
  value: {
    id: string;
    label: string;
  };
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleClick = () => {
    const params = new URLSearchParams(searchParams);
    params.set(urlParam, value.id);
    params.delete("page"); // Reset the page number when a filter is changed
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <button className={className} onClick={handleClick}>
      {value.label}
    </button>
  );
}

export function DateRangeMenu({ isActive }: { isActive: boolean }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [startDate, setStartDate] = useState(
    searchParams.get("start_date") || ""
  );
  const [endDate, setEndDate] = useState(searchParams.get("end_date") || "");

  const currentStartDate = searchParams.get("start_date");
  const currentEndDate = searchParams.get("end_date");

  function handleFilterChange() {
    const params = new URLSearchParams(searchParams);

    if (startDate) {
      params.set("start_date", startDate);
    } else {
      params.delete("start_date");
    }

    if (endDate) {
      params.set("end_date", endDate);
    } else {
      params.delete("end_date");
    }

    params.delete("page"); // Reset the page number when a filter is changed
    replace(`${pathname}?${params.toString()}`);
  }

  function clearFilter() {
    const params = new URLSearchParams(searchParams);
    setStartDate("");
    setEndDate("");
    params.delete("start_date");
    params.delete("end_date");
    params.delete("page"); // Reset the page number when a filter is changed
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <Disclosure>
      <DisclosureButton
        className={`flex items-center justify-between w-full p-2 rounded-md relative border ${isActive ? "border-blue-500" : "border-foreground"} `}
      >
        {currentStartDate || currentEndDate ? (
          <span>
            Date Range: {currentStartDate || "∞"} to {currentEndDate || "∞"}
          </span>
        ) : (
          <span>Date Range</span>
        )}
      </DisclosureButton>
      <DisclosurePanel className="p-4 absolute bg-background shadow-sm shadow-foreground">
        {({ close }) => (
          <div>
            <div className="flex gap-2 items-center">
              <div>
                <input
                  type="date"
                  className="w-full p-2 border border-foreground rounded-md"
                  onChange={(e) => setStartDate(e.target.value)}
                  value={startDate}
                />
              </div>
              -
              <div>
                <input
                  type="date"
                  className="w-full p-2 border border-foreground rounded-md"
                  onChange={(e) => setEndDate(e.target.value)}
                  value={endDate}
                />
              </div>
            </div>
            <button
              className="w-full p-2 border border-foreground rounded-md mt-2"
              onClick={() => {
                handleFilterChange();
                close();
              }}
            >
              Apply
            </button>
            <button
              className="w-full p-2 border border-foreground rounded-md mt-2"
              onClick={() => {
                clearFilter();
                close();
              }}
            >
              Clear Filter
            </button>
          </div>
        )}
      </DisclosurePanel>
    </Disclosure>
  );
}

export function PriceRangeMenu({ isActive }: { isActive: boolean }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [minPrice, setMinPrice] = useState(searchParams.get("min_price") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("max_price") || "");

  const currentMinPrice = searchParams.get("min_price");
  const currentMaxPrice = searchParams.get("max_price");

  function handleFilterChange() {
    const params = new URLSearchParams(searchParams);

    if (minPrice) {
      params.set("min_price", minPrice);
    } else {
      params.delete("min_price");
    }

    if (maxPrice) {
      params.set("max_price", maxPrice);
    } else {
      params.delete("max_price");
    }

    params.delete("page"); // Reset the page number when a filter is changed
    replace(`${pathname}?${params.toString()}`);
  }

  function clearFilter() {
    const params = new URLSearchParams(searchParams);
    setMinPrice("");
    setMaxPrice("");
    params.delete("min_price");
    params.delete("max_price");
    params.delete("page"); // Reset the page number when a filter is changed
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <Disclosure>
      <DisclosureButton
        className={`flex items-center justify-between w-full p-2 rounded-md relative border ${isActive ? "border-blue-500" : "border-foreground"} `}
      >
        {currentMinPrice || currentMaxPrice ? (
          <span>
            Price Range: {currentMinPrice || "0"} - {currentMaxPrice || "∞"}
          </span>
        ) : (
          <span>Price Range</span>
        )}
      </DisclosureButton>
      <DisclosurePanel className="p-4 absolute bg-background shadow-sm shadow-foreground">
        {({ close }) => (
          <div>
            <div className="flex gap-2 items-center">
              <div>
                <input
                  type="number"
                  className="w-full p-2 border border-foreground rounded-md"
                  placeholder="Minimum"
                  onChange={(e) => setMinPrice(e.target.value)}
                  defaultValue={minPrice}
                />
              </div>
              -
              <div>
                <input
                  type="number"
                  className="w-full p-2 border border-foreground rounded-md"
                  placeholder="Maximum"
                  onChange={(e) => setMaxPrice(e.target.value)}
                  defaultValue={maxPrice}
                />
              </div>
            </div>
            <button
              className="w-full p-2 border border-foreground rounded-md mt-2"
              onClick={() => {
                handleFilterChange();
                close();
              }}
            >
              Apply
            </button>
            <button
              className="w-full p-2 border border-foreground rounded-md mt-2"
              onClick={() => {
                clearFilter();
                close();
              }}
            >
              Clear Filter
            </button>
          </div>
        )}
      </DisclosurePanel>
    </Disclosure>
  );
}

export function ClientDisclosureWrapper({
  serverComponent,
  label,
  currentCount,
}: {
  serverComponent: React.ReactNode;
  label: string;
  currentCount: number;
}) {
  return (
    <Disclosure>
      <DisclosureButton
        className={`flex items-center justify-between w-full p-2 rounded-md relative border ${currentCount > 0 ? "border-blue-500" : "border-foreground"} `}
      >
        <span>{label}</span>
        {currentCount > 0 && (
          <span className="text-sm ml-4 px-2 bg-blue-500 text-white rounded-full">
            {currentCount}
          </span>
        )}
      </DisclosureButton>
      <DisclosurePanel className="p-4 absolute bg-background shadow-sm shadow-foreground">
        {serverComponent}
      </DisclosurePanel>
    </Disclosure>
  );
}
