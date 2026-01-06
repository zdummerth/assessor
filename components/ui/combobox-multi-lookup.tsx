// components/ui/combobox-multi-lookup.tsx
"use client";

import * as React from "react";
import useSWR from "swr";
import { ComboboxMulti, ComboOption } from "./combobox-multi";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type FetcherParams = Record<string, string | number | boolean | undefined>;

type ComboboxMultiLookupProps = {
  // API configuration
  endpoint: string;
  params?: FetcherParams;

  // Data transformation
  valueKey?: string;
  labelKey?: string;
  transformData?: (data: any[]) => ComboOption[];

  // SWR configuration
  revalidateOnFocus?: boolean;
  revalidateOnReconnect?: boolean;
  refreshInterval?: number;
  dedupingInterval?: number;

  // ComboboxMulti props - Supports both controlled and uncontrolled
  value?: string[]; // Optional for uncontrolled
  defaultValue?: string[]; // Initial value for uncontrolled
  onChange?: (next: string[]) => void; // Optional for uncontrolled
  onSelectionChange?: (next: string[]) => void; // Alternative callback name
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  showFooter?: boolean;
  maxBadges?: number;
  title?: string;
  description?: string;
  widthClass?: string;
  badgeVariant?: "secondary" | "outline";
  showSelectAll?: boolean;
  showProgress?: boolean;
  searchPlaceholder?: string;
  maxSelections?: number;
  groupBy?: (option: ComboOption) => string;
  emptyMessage?: string;

  // Loading/Error customization
  loadingMessage?: string;
  errorMessage?: string;
  showLoadingSpinner?: boolean;
};

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error("Failed to fetch options");
    throw error;
  }
  return res.json();
};

export function ComboboxMultiLookup({
  // API configuration
  endpoint,
  params = {},

  // Data transformation
  valueKey = "value",
  labelKey = "label",
  transformData,

  // SWR configuration
  revalidateOnFocus = false,
  revalidateOnReconnect = true,
  refreshInterval,
  dedupingInterval = 2000,

  // ComboboxMulti props
  value: controlledValue,
  defaultValue = [],
  onChange,
  onSelectionChange,
  placeholder = "Select…",
  className,
  disabled,
  showFooter = true,
  maxBadges = 5,
  title = "Select options",
  description,
  widthClass = "sm:max-w-md",
  badgeVariant = "secondary",
  showSelectAll = true,
  showProgress = false,
  searchPlaceholder = "Search options…",
  maxSelections,
  groupBy,
  emptyMessage = "No results found.",

  // Loading/Error customization
  loadingMessage = "Loading options…",
  errorMessage = "Failed to load options. Click to retry.",
  showLoadingSpinner = true,
}: ComboboxMultiLookupProps) {
  // Internal state for uncontrolled mode
  const [internalValue, setInternalValue] =
    React.useState<string[]>(defaultValue);

  // Determine if controlled or uncontrolled
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  // Unified change handler
  const handleChange = React.useCallback(
    (next: string[]) => {
      // Update internal state if uncontrolled
      if (!isControlled) {
        setInternalValue(next);
      }

      // Call both callbacks if provided
      onChange?.(next);
      onSelectionChange?.(next);
    },
    [isControlled, onChange, onSelectionChange]
  );

  // Build URL with query params
  const url = React.useMemo(() => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, String(value));
      }
    });
    const queryString = queryParams.toString();
    return queryString ? `${endpoint}?${queryString}` : endpoint;
  }, [endpoint, params]);

  // Fetch data with SWR
  const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
    revalidateOnFocus,
    revalidateOnReconnect,
    refreshInterval,
    dedupingInterval,
  });

  // Transform data to ComboOption format
  const options: ComboOption[] = React.useMemo(() => {
    if (!data) return [];

    // Use custom transformer if provided
    if (transformData) {
      return transformData(data.data);
    }

    // Handle array of data
    const dataArray = Array.isArray(data)
      ? data
      : data.data || data.items || [];

    return dataArray.map((item: any) => ({
      value: String(item[valueKey]),
      label: String(item[labelKey]),
    }));
  }, [data, valueKey, labelKey, transformData]);

  // Loading state
  if (isLoading) {
    return (
      <div
        className={cn(
          "flex w-full min-h-9 items-center justify-between rounded-md border bg-background px-2 py-1 text-left text-xs",
          "cursor-wait opacity-60",
          className
        )}
      >
        <span className="truncate text-muted-foreground flex items-center gap-2">
          {showLoadingSpinner && <Loader2 className="h-3 w-3 animate-spin" />}
          {loadingMessage}
        </span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        role="button"
        onClick={() => mutate()}
        className={cn(
          "flex w-full min-h-9 items-center justify-between rounded-md border border-destructive/50 bg-background px-2 py-1 text-left text-xs",
          "cursor-pointer hover:bg-destructive/10 transition-colors",
          className
        )}
      >
        <span className="truncate text-destructive flex items-center gap-2">
          <span className="text-destructive">⚠</span>
          {errorMessage}
        </span>
      </div>
    );
  }

  // Render combobox with fetched options
  return (
    <ComboboxMulti
      options={options}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      className={className}
      disabled={disabled || isLoading}
      showFooter={showFooter}
      maxBadges={maxBadges}
      title={title}
      description={description}
      widthClass={widthClass}
      badgeVariant={badgeVariant}
      showSelectAll={showSelectAll}
      showProgress={showProgress}
      searchPlaceholder={searchPlaceholder}
      maxSelections={maxSelections}
      groupBy={groupBy}
      emptyMessage={emptyMessage}
    />
  );
}
