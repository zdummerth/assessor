"use client";

import * as React from "react";
import useSWR from "swr";
import { Check, ChevronsUpDown, Loader2, X } from "lucide-react";

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
import { Badge } from "@/components/ui/badge";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

export type MultiComboboxOption = {
  value: string;
  label: string;
};

type MultiComboboxProps = {
  // Options: provide either static options OR endpoint for fetching
  options?: MultiComboboxOption[];
  endpoint?: string;
  params?: Record<string, string | number | boolean | undefined>;
  transformData?: (data: any) => MultiComboboxOption[];

  value: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  loadingMessage?: string;
  className?: string;
  disabled?: boolean;
  maxSelected?: number;
  showBadges?: boolean;
  showClearAll?: boolean;
  onOptionNotFound?: (values: string[]) => void;
};

export function MultiCombobox({
  options: staticOptions,
  endpoint,
  params = {},
  transformData,
  value,
  onChange,
  placeholder = "Select options…",
  searchPlaceholder = "Search…",
  emptyMessage = "No results found.",
  loadingMessage = "Loading…",
  className,
  disabled = false,
  maxSelected,
  showBadges = true,
  showClearAll = true,
  onOptionNotFound,
}: MultiComboboxProps) {
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
  const options: MultiComboboxOption[] = React.useMemo(() => {
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

  // Check if current values exist in options
  React.useEffect(() => {
    if (!onOptionNotFound || value.length === 0 || isLoading) return;

    const invalidValues = value.filter(
      (v) => !options.some((option) => String(option.value) === String(v))
    );

    if (invalidValues.length > 0 && options.length > 0) {
      onOptionNotFound(invalidValues);
    }
  }, [value, options, isLoading, onOptionNotFound]);

  const handleSelect = React.useCallback(
    (selectedValue: string) => {
      const isSelected = value.includes(selectedValue);

      if (isSelected) {
        // Remove from selection
        onChange(value.filter((v) => v !== selectedValue));
      } else {
        // Check max limit
        if (maxSelected && value.length >= maxSelected) {
          return;
        }
        // Add to selection
        onChange([...value, selectedValue]);
      }
    },
    [value, onChange, maxSelected]
  );

  const handleRemove = React.useCallback(
    (valueToRemove: string) => {
      onChange(value.filter((v) => v !== valueToRemove));
    },
    [value, onChange]
  );

  const handleClearAll = React.useCallback(() => {
    onChange([]);
  }, [onChange]);

  const selectedLabels = React.useMemo(() => {
    return value
      .map((v) => options.find((opt) => String(opt.value) === String(v))?.label)
      .filter(Boolean);
  }, [value, options]);

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
          <div className="flex items-center gap-1 flex-1 min-w-0">
            {isLoading && <Loader2 className="h-4 w-4 animate-spin shrink-0" />}
            {value.length > 0 ? (
              showBadges ? (
                <div className="flex items-center gap-1 flex-wrap">
                  {selectedLabels.slice(0, 2).map((label, idx) => (
                    <Badge
                      key={`${value[idx]}-${idx}`}
                      variant="secondary"
                      className="text-xs"
                    >
                      {label}
                    </Badge>
                  ))}
                  {selectedLabels.length > 2 && (
                    <span className="text-sm text-muted-foreground">
                      +{selectedLabels.length - 2} more
                    </span>
                  )}
                </div>
              ) : (
                <span className="truncate">{value.length} selected</span>
              )
            ) : (
              <span className="text-muted-foreground truncate">
                {placeholder}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {value.length > 0 && (
              <X
                className="h-4 w-4 opacity-50 hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearAll();
                }}
              />
            )}
            <ChevronsUpDown className="h-4 w-4 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} className="h-9" />
          {showClearAll && value.length > 0 && (
            <div className="border-b px-2 py-1.5">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs w-full"
                onClick={handleClearAll}
              >
                Clear All ({value.length})
              </Button>
            </div>
          )}
          <CommandList>
            {isLoading ? (
              <div className="py-6 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {loadingMessage}
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
                    const isSelected = value.includes(String(option.value));
                    const isDisabled =
                      maxSelected && !isSelected && value.length >= maxSelected;

                    return (
                      <CommandItem
                        key={`${option.value}-${index}`}
                        value={option.value}
                        onSelect={() => handleSelect(String(option.value))}
                        disabled={isDisabled || undefined}
                        className={cn(
                          isDisabled && "opacity-50 cursor-not-allowed"
                        )}
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
                {maxSelected && (
                  <div className="border-t px-2 py-1.5 text-xs text-muted-foreground text-center">
                    {value.length} / {maxSelected} selected
                  </div>
                )}
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
