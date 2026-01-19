"use client";

import * as React from "react";
import useSWR from "swr";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

export type ComboboxOption = {
  value: string;
  label: string;
};

type ComboboxProps = {
  // Options: provide either static options OR endpoint for fetching
  options?: ComboboxOption[];
  endpoint?: string;
  params?: Record<string, string | number | boolean | undefined>;
  transformData?: (data: any) => ComboboxOption[];

  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
  disabled?: boolean;
};

export function Combobox({
  options: staticOptions,
  endpoint,
  params = {},
  transformData,
  value,
  onChange,
  placeholder = "Select option…",
  searchPlaceholder = "Search…",
  emptyMessage = "No results found.",
  className,
  disabled = false,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);

  // Build URL if endpoint is provided
  const url = React.useMemo(() => {
    if (!endpoint) return null;
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") {
        queryParams.append(key, String(val));
      }
    });
    const queryString = queryParams.toString();
    return queryString ? `${endpoint}?${queryString}` : endpoint;
  }, [endpoint, params]);

  // Fetch data with SWR (only if endpoint is provided)
  const { data, error, isLoading } = useSWR(
    disabled || !endpoint ? null : url,
    fetcher,
    { dedupingInterval: 60000 }
  );

  // Determine options from static or fetched data
  const options: ComboboxOption[] = React.useMemo(() => {
    // Use static options if provided
    if (staticOptions) return staticOptions;

    // Otherwise use fetched data
    if (!data) return [];

    if (transformData) {
      return transformData(data.data || data);
    }

    const dataArray = Array.isArray(data)
      ? data
      : data.data || data.items || [];
    return dataArray.map((item: any) => ({
      value: String(item.value || item.id),
      label: String(item.label || item.name),
    }));
  }, [staticOptions, data, transformData]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled || isLoading}
          className={cn("w-full justify-between", className)}
        >
          {value !== "" || value
            ? options.find((option) => String(option.value) === String(value))
                ?.label
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} className="h-9" />
          <CommandList>
            {isLoading ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Loading…
              </div>
            ) : error ? (
              <div className="py-6 text-center text-sm text-destructive">
                Failed to load options
              </div>
            ) : (
              <>
                <CommandEmpty>{emptyMessage}</CommandEmpty>
                <CommandGroup>
                  {options.map((option, index) => {
                    const isSelected = String(value) === String(option.value);
                    return (
                      <CommandItem
                        key={`${option.value}-${index}`}
                        value={option.value}
                        onSelect={(selectedValue) => {
                          onChange(
                            selectedValue === value ? "" : selectedValue
                          );
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            isSelected ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {option.label}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
