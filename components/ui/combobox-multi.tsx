// app/components/ui/combobox-multi.tsx
"use client";

import * as React from "react";
import { Check, Search, X } from "lucide-react";
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
}: ComboboxMultiProps) {
  const [open, setOpen] = React.useState(false);
  const selectedSet = React.useMemo(() => new Set(value), [value]);

  const toggle = (v: string) => {
    if (selectedSet.has(v)) {
      onChange(value.filter((x) => x !== v));
    } else {
      onChange([...value, v]);
    }
  };

  const clearAll = () => onChange([]);

  const selected = React.useMemo(
    () => options.filter((o) => selectedSet.has(o.value)),
    [options, selectedSet]
  );
  const visible = selected.slice(0, maxBadges);
  const hiddenCount = Math.max(0, selected.length - visible.length);

  const handleTriggerKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(true);
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
            tabIndex={disabled ? -1 : 0}
            onClick={() => !disabled && setOpen(true)}
            onKeyDown={handleTriggerKeyDown}
            className={cn(
              "flex w-full min-h-9 items-center justify-between rounded-md border bg-background px-2 py-1 text-left text-xs",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              disabled && "cursor-not-allowed opacity-60"
            )}
          >
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1">
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
                      className="shrink-0 text-[11px]"
                    >
                      {o.label}
                      <button
                        type="button"
                        className="ml-1 outline-none"
                        onClick={(e) => {
                          e.stopPropagation(); // don't re-open dialog
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
                      className="shrink-0 text-[11px] text-muted-foreground"
                    >
                      +{hiddenCount} more
                    </Badge>
                  )}
                </>
              )}
            </div>

            <div className="ml-2 flex items-center gap-1">
              {selected.length > 0 && (
                <button
                  type="button"
                  className="rounded-full p-1 text-[10px] text-muted-foreground hover:bg-muted"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearAll();
                  }}
                  aria-label="Clear selection"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </DialogTrigger>

        <DialogContent className={cn("flex flex-col gap-0 p-0", widthClass)}>
          <DialogHeader className="px-4 pt-4 pb-2">
            <DialogTitle className="text-base">{title}</DialogTitle>
            {description && (
              <DialogDescription className="text-xs">
                {description}
              </DialogDescription>
            )}
          </DialogHeader>

          <div className="px-4 pb-4 pt-1 flex-1">
            <Command shouldFilter>
              <div className="pb-2">
                <CommandInput
                  autoFocus
                  placeholder="Search…"
                  className="h-9 text-sm"
                />
              </div>
              <CommandList className="max-h-80 overflow-auto rounded-md border">
                <CommandEmpty className="py-4 text-sm text-muted-foreground">
                  No results.
                </CommandEmpty>
                <CommandGroup>
                  {options.map((opt) => {
                    const isSelected = selectedSet.has(opt.value);
                    return (
                      <CommandItem
                        key={opt.value}
                        value={`${opt.label} ${opt.value}`}
                        onSelect={() => {
                          toggle(opt.value);
                        }}
                        className="cursor-pointer text-sm"
                      >
                        <div
                          className={cn(
                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border",
                            isSelected &&
                              "border-primary bg-primary text-primary-foreground"
                          )}
                        >
                          {isSelected && <Check className="h-3 w-3" />}
                        </div>
                        <span className="truncate">{opt.label}</span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>

            {selected.length > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-1">
                {visible.map((o) => (
                  <Badge
                    key={`sel-${o.value}`}
                    variant="secondary"
                    className="text-[11px]"
                  >
                    {o.label}
                    <button
                      type="button"
                      className="ml-1 outline-none"
                      onClick={() => toggle(o.value)}
                      aria-label={`Remove ${o.label}`}
                    >
                      <X className="h-3 w-3 opacity-70 hover:opacity-100" />
                    </button>
                  </Badge>
                ))}
                {hiddenCount > 0 && (
                  <Badge variant="outline" className="text-[11px]">
                    +{hiddenCount} more
                  </Badge>
                )}
              </div>
            )}
          </div>

          {showFooter && (
            <DialogFooter className="gap-2 border-top px-4 py-3 border-t">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearAll}
                disabled={value.length === 0}
                className="mr-auto text-xs"
              >
                Clear
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => setOpen(false)}
                className="text-xs"
              >
                Done
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </div>
    </Dialog>
  );
}
