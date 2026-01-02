// app/components/ui/combobox-multi.tsx
"use client";

import * as React from "react";
import {
  Check,
  Search,
  X,
  ChevronDown,
  CheckSquare,
  Square,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export type ComboOption = { value: string; label: string };

type ComboboxMultiProps = {
  options: ComboOption[];
  value: string[];
  onChange: (next: string[]) => void;
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
};

export function ComboboxMulti({
  options,
  value,
  onChange,
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
}: ComboboxMultiProps) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");
  const selectedSet = React.useMemo(() => new Set(value), [value]);

  const toggle = (v: string) => {
    if (disabled) return;
    if (maxSelections && !selectedSet.has(v) && value.length >= maxSelections)
      return;

    if (selectedSet.has(v)) {
      onChange(value.filter((x) => x !== v));
    } else {
      onChange([...value, v]);
    }
  };

  const clearAll = () => onChange([]);

  const selectAll = () => {
    if (maxSelections) {
      onChange(options.slice(0, maxSelections).map((o) => o.value));
    } else {
      onChange(options.map((o) => o.value));
    }
  };

  const isAllSelected = options.length > 0 && value.length === options.length;
  const isSomeSelected = value.length > 0 && value.length < options.length;

  const selected = React.useMemo(
    () => options.filter((o) => selectedSet.has(o.value)),
    [options, selectedSet]
  );
  const visible = selected.slice(0, maxBadges);
  const hiddenCount = Math.max(0, selected.length - visible.length);

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

  const handleTriggerKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(true);
    }
  };

  const handleDialogKeyDown = (e: React.KeyboardEvent) => {
    // Escape to close
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }

    // Ctrl/Cmd + A to select all
    if ((e.ctrlKey || e.metaKey) && e.key === "a" && showSelectAll) {
      e.preventDefault();
      if (isAllSelected) {
        clearAll();
      } else {
        selectAll();
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !disabled && setOpen(v)}>
      <div className={cn("w-full", className)}>
        <DialogTrigger asChild>
          <div
            role="button"
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-label={`${selected.length} of ${options.length} options selected`}
            tabIndex={disabled ? -1 : 0}
            onClick={() => !disabled && setOpen(true)}
            onKeyDown={handleTriggerKeyDown}
            className={cn(
              "flex w-full min-h-9 items-center justify-between rounded-md border bg-background px-2 py-1 text-left text-xs",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              "hover:bg-accent/10 transition-colors",
              disabled && "cursor-not-allowed opacity-60"
            )}
          >
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1 min-h-[24px] py-0.5">
              {selected.length === 0 ? (
                <span className="truncate text-muted-foreground">
                  {placeholder}
                </span>
              ) : (
                <>
                  {visible.map((o) => (
                    <Badge
                      key={o.value}
                      variant={badgeVariant}
                      className="shrink-0 text-[11px] h-5"
                    >
                      {o.label}
                      <button
                        type="button"
                        className="ml-1 outline-none rounded-sm hover:bg-background/20"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggle(o.value);
                        }}
                        aria-label={`Remove ${o.label}`}
                      >
                        <X className="h-3 w-3 opacity-70 hover:opacity-100" />
                      </button>
                    </Badge>
                  ))}
                  {hiddenCount > 0 && (
                    <Badge
                      variant="outline"
                      className="shrink-0 text-[11px] text-muted-foreground h-5"
                    >
                      +{hiddenCount} more
                    </Badge>
                  )}
                </>
              )}
            </div>

            <div className="ml-2 flex items-center gap-1 min-w-0">
              {/* Reserve space for progress indicator to prevent layout shift */}
              <div className="flex items-center">
                {showProgress && options.length > 0 ? (
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                    {selected.length}/{maxSelections || options.length}
                  </span>
                ) : showProgress ? (
                  <span className="text-[10px] text-transparent whitespace-nowrap">
                    0/{options.length}
                  </span>
                ) : null}
              </div>
              {/* Reserve space for clear button to prevent layout shift */}
              <div className="flex items-center w-5 justify-center">
                {selected.length > 0 && (
                  <button
                    type="button"
                    className="rounded-full p-1 text-[10px] text-muted-foreground hover:bg-muted transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearAll();
                    }}
                    aria-label="Clear selection"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 shrink-0" />
            </div>
          </div>
        </DialogTrigger>

        <DialogContent
          className={cn("flex flex-col gap-0 p-0 min-h-[400px]", widthClass)}
          onKeyDown={handleDialogKeyDown}
        >
          <DialogHeader className="px-4 pt-4 pb-2">
            <DialogTitle className="text-base flex items-center justify-between">
              <span>{title}</span>
              {showProgress && (
                <span className="text-xs font-normal text-muted-foreground">
                  {selected.length} of {options.length} selected
                </span>
              )}
            </DialogTitle>
            {description && (
              <DialogDescription className="text-xs">
                {description}
              </DialogDescription>
            )}
          </DialogHeader>

          <div className="px-4 pb-4 pt-1 flex-1">
            <Command shouldFilter>
              <div className="pb-2 space-y-2">
                <CommandInput
                  autoFocus
                  placeholder={searchPlaceholder}
                  className="h-9 text-sm"
                  value={searchValue}
                  onValueChange={setSearchValue}
                />

                {/* Reserve consistent space for select all section */}
                <div className="min-h-[20px] flex flex-col">
                  {showSelectAll && options.length > 0 && (
                    <>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            isAllSelected ? clearAll() : selectAll()
                          }
                          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                          disabled={
                            !!(maxSelections && options.length > maxSelections)
                          }
                        >
                          {isAllSelected ? (
                            <CheckSquare className="h-4 w-4 shrink-0" />
                          ) : isSomeSelected ? (
                            <div className="h-4 w-4 border rounded flex items-center justify-center shrink-0">
                              <div className="h-2 w-2 bg-primary rounded-sm" />
                            </div>
                          ) : (
                            <Square className="h-4 w-4 shrink-0" />
                          )}
                          <span className="whitespace-nowrap">
                            {isAllSelected ? "Deselect all" : "Select all"}
                            {maxSelections &&
                              options.length > maxSelections &&
                              ` (max ${maxSelections})`}
                          </span>
                        </button>
                      </div>
                      <Separator className="mt-2" />
                    </>
                  )}
                </div>
              </div>

              <CommandList className="h-40 overflow-auto rounded-md border">
                <CommandEmpty className="py-4 text-sm text-muted-foreground">
                  {emptyMessage}
                </CommandEmpty>

                {Object.entries(groupedOptions).map(
                  ([groupName, groupOptions]) => (
                    <CommandGroup
                      key={groupName}
                      heading={groupName || undefined}
                    >
                      {groupOptions.map((opt) => {
                        const isSelected = selectedSet.has(opt.value);
                        const canSelect =
                          !maxSelections ||
                          isSelected ||
                          value.length < maxSelections;

                        return (
                          <CommandItem
                            key={opt.value}
                            value={`${opt.label} ${opt.value}`}
                            onSelect={() => {
                              if (canSelect) {
                                toggle(opt.value);
                              }
                            }}
                            className={cn(
                              "cursor-pointer text-sm transition-colors",
                              !canSelect && "opacity-50 cursor-not-allowed"
                            )}
                            disabled={!canSelect}
                          >
                            <div
                              className={cn(
                                "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border transition-colors",
                                isSelected &&
                                  "border-primary bg-primary text-primary-foreground",
                                !canSelect && "border-muted"
                              )}
                            >
                              {isSelected && <Check className="h-3 w-3" />}
                            </div>
                            <span className="truncate">{opt.label}</span>
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  )
                )}
              </CommandList>
            </Command>

            {/* Reserve consistent space for selected items to prevent layout shift */}
            <div className="mt-3 h-[80px]">
              {selected.length > 0 && (
                <div className="space-y-2 h-full overflow-auto">
                  <div className="text-xs text-muted-foreground">
                    Selected ({selected.length}):
                  </div>
                  <div className="flex flex-wrap items-start gap-1 overflow-auto max-h-[60px]">
                    {visible.map((o) => (
                      <Badge
                        key={`sel-${o.value}`}
                        variant="secondary"
                        className="text-[11px] transition-opacity h-5 flex-shrink-0"
                      >
                        {o.label}
                        <button
                          type="button"
                          className="ml-1 outline-none rounded-sm hover:bg-background/20 transition-colors"
                          onClick={() => toggle(o.value)}
                          aria-label={`Remove ${o.label}`}
                        >
                          <X className="h-3 w-3 opacity-70 hover:opacity-100" />
                        </button>
                      </Badge>
                    ))}
                    {hiddenCount > 0 && (
                      <Badge
                        variant="outline"
                        className="text-[11px] h-5 flex-shrink-0"
                      >
                        +{hiddenCount} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {showFooter && (
            <DialogFooter className="gap-2 border-top px-4 py-3 border-t flex-shrink-0">
              <div className="flex items-center gap-2 mr-auto min-w-0">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearAll}
                  disabled={value.length === 0}
                  className="text-xs whitespace-nowrap"
                >
                  Clear
                </Button>
                {showSelectAll && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => (isAllSelected ? clearAll() : selectAll())}
                    disabled={
                      !!(maxSelections && options.length > maxSelections)
                    }
                    className="text-xs whitespace-nowrap"
                  >
                    {isAllSelected ? "Deselect All" : "Select All"}
                  </Button>
                )}
              </div>
              <div className="text-xs text-muted-foreground text-center min-w-0">
                {searchValue && (
                  <span className="mr-2 whitespace-nowrap">
                    Press Ctrl+A to select all
                  </span>
                )}
                <span className="whitespace-nowrap">Press Esc to close</span>
              </div>
              <Button
                type="button"
                size="sm"
                onClick={() => setOpen(false)}
                className="text-xs whitespace-nowrap flex-shrink-0"
              >
                Done ({selected.length})
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </div>
    </Dialog>
  );
}
