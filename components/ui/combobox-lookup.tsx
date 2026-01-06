// components/ui/combobox-lookup.tsx
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
import { Label } from "@/components/ui/label";

export type ComboOption = { value: string; label: string };

type FetcherParams = Record<string, string | number | boolean | undefined>;

type ComboboxLookupProps = {
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

  // Combobox props - Supports both controlled and uncontrolled
  value?: string; // Optional for uncontrolled
  defaultValue?: string; // Initial value for uncontrolled
  onChange?: (value: string | undefined) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
  allowClear?: boolean;

  // Form field props
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  containerClassName?: string;

  // Group options
  groupBy?: (option: ComboOption) => string;

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

export function ComboboxLookup({
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

  // Combobox props
  value: controlledValue,
  defaultValue = "",
  onChange,
  placeholder = "Select option…",
  searchPlaceholder = "Search…",
  emptyMessage = "No results found.",
  disabled,
  className,
  allowClear = true,

  // Form field props
  label,
  error,
  helperText,
  required,
  containerClassName,

  // Group options
  groupBy,

  // Loading/Error customization
  loadingMessage = "Loading…",
  errorMessage = "Failed to load. Click to retry.",
  showLoadingSpinner = true,
}: ComboboxLookupProps) {
  const [open, setOpen] = React.useState(false);
  const [internalValue, setInternalValue] =
    React.useState<string>(defaultValue);

  // Determine if controlled or uncontrolled
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  // Unified change handler
  const handleChange = React.useCallback(
    (newValue: string | undefined) => {
      // Update internal state if uncontrolled
      if (!isControlled) {
        setInternalValue(newValue || "");
      }

      console.log("ComboboxLookup selected value:", newValue);

      // Call onChange callback
      onChange?.(newValue);
    },
    [isControlled, onChange]
  );

  // Build URL with query params
  const url = React.useMemo(() => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") {
        queryParams.append(key, String(val));
      }
    });
    const queryString = queryParams.toString();
    return queryString ? `${endpoint}?${queryString}` : endpoint;
  }, [endpoint, params]);

  // Fetch data with SWR
  const {
    data,
    error: fetchError,
    isLoading,
    mutate,
  } = useSWR(url, fetcher, {
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
      return transformData(data.data || data);
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

  // Group options if groupBy function is provided
  const groupedOptions = React.useMemo(() => {
    if (!groupBy) return { "": options };

    const groups: Record<string, ComboOption[]> = {};
    options.forEach((option) => {
      const group = groupBy(option);
      if (!groups[group]) groups[group] = [];
      groups[group].push(option);
    });
    return groups;
  }, [options, groupBy]);

  // Get selected option
  const selectedOption = options.find((opt) => opt.value === value);

  const inputId = `combobox-${label?.toLowerCase().replace(/\s+/g, "-")}`;

  // Loading state
  if (isLoading) {
    return (
      <div className={cn("space-y-2", containerClassName)}>
        {label && (
          <Label htmlFor={inputId} className="text-sm font-medium">
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </Label>
        )}
        <div
          className={cn(
            "flex w-full min-h-10 items-center justify-between rounded-md border bg-background px-3 py-2",
            "cursor-wait opacity-60",
            className
          )}
        >
          <span className="text-muted-foreground flex items-center gap-2 text-sm">
            {showLoadingSpinner && <Loader2 className="h-4 w-4 animate-spin" />}
            {loadingMessage}
          </span>
        </div>
        {helperText && (
          <p className="text-sm text-muted-foreground">{helperText}</p>
        )}
      </div>
    );
  }

  // Error state
  if (fetchError) {
    return (
      <div className={cn("space-y-2", containerClassName)}>
        {label && (
          <Label htmlFor={inputId} className="text-sm font-medium">
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </Label>
        )}
        <div
          role="button"
          onClick={() => mutate()}
          className={cn(
            "flex w-full min-h-10 items-center justify-between rounded-md border border-destructive/50 bg-background px-3 py-2",
            "cursor-pointer hover:bg-destructive/10 transition-colors",
            className
          )}
        >
          <span className="text-destructive flex items-center gap-2 text-sm">
            <span className="text-destructive">⚠</span>
            {errorMessage}
          </span>
        </div>
        {helperText && (
          <p className="text-sm text-muted-foreground">{helperText}</p>
        )}
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", containerClassName)}>
      {label && (
        <Label htmlFor={inputId} className="text-sm font-medium">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      <div className="relative">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id={inputId}
              variant="outline"
              role="combobox"
              aria-expanded={open}
              disabled={disabled || isLoading}
              className={cn(
                "w-full justify-between font-normal",
                !value && "text-muted-foreground",
                error && "border-destructive focus-visible:ring-destructive",
                allowClear && value && !disabled && "pr-12",
                className
              )}
              aria-invalid={error ? "true" : "false"}
              aria-describedby={
                error
                  ? `${inputId}-error`
                  : helperText
                    ? `${inputId}-helper`
                    : undefined
              }
            >
              <span className="truncate">
                {selectedOption ? selectedOption.label : placeholder}
              </span>
              <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
            <Command>
              <CommandInput placeholder={searchPlaceholder} />
              <CommandList>
                <CommandEmpty>{emptyMessage}</CommandEmpty>
                {Object.entries(groupedOptions).map(
                  ([groupName, groupOptions]) => (
                    <CommandGroup
                      key={groupName}
                      heading={groupName || undefined}
                    >
                      {groupOptions.map((option) => (
                        <CommandItem
                          key={option.value}
                          value={option.label}
                          onSelect={(currentLabel) => {
                            // Find the option by label to get its value
                            const selectedOption = groupOptions.find(
                              (opt) => opt.label === currentLabel
                            );
                            if (selectedOption) {
                              handleChange(
                                selectedOption.value === value
                                  ? undefined
                                  : selectedOption.value
                              );
                            }
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              value === option.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {option.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {allowClear && value && !disabled && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-8 top-0 h-full px-2 hover:bg-transparent"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleChange(undefined);
            }}
          >
            <X className="h-4 w-4 opacity-50 hover:opacity-100" />
          </Button>
        )}
      </div>
      {error && (
        <p
          id={`${inputId}-error`}
          className="text-sm text-destructive font-medium"
        >
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={`${inputId}-helper`} className="text-sm text-muted-foreground">
          {helperText}
        </p>
      )}
    </div>
  );
}
