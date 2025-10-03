// app/components/ui/combobox-multi.tsx
"use client";

import * as React from "react";
import { Check, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
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

export type ComboOption = { value: string; label: string };

type ComboboxMultiProps = {
  options: ComboOption[];
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string; // shown next to trigger when no selections
  className?: string; // extra classes for the whole row (badges + trigger)
  disabled?: boolean;
  showFooter?: boolean;
  maxBadges?: number; // cap visible badges (rest collapsed as “+N more”)
  title?: string;
  description?: string;
  widthClass?: string; // dialog width (default: max-w-md)
  badgeVariant?: "secondary" | "outline";
};

export function ComboboxMulti({
  options,
  value,
  onChange,
  placeholder = "None",
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
    if (selectedSet.has(v)) onChange(value.filter((x) => x !== v));
    else onChange([...value, v]);
  };
  const clearAll = () => onChange([]);

  const selected = React.useMemo(
    () => options.filter((o) => selectedSet.has(o.value)),
    [options, selectedSet]
  );
  const visible = selected.slice(0, maxBadges);
  const hiddenCount = Math.max(0, selected.length - visible.length);

  // a11y keyboard: open/close with Enter/Space/Escape on the trigger
  const onTriggerKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen((p) => !p);
    }
    if (e.key === "Escape") setOpen(false);
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Badges live OUTSIDE the dialog trigger */}
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1">
        {visible.map((o) => (
          <Badge key={o.value} variant={badgeVariant} className="shrink-0">
            {o.label}
            <button
              type="button"
              className="ml-1 outline-none"
              onClick={(e) => {
                e.stopPropagation(); // don't open the dialog
                toggle(o.value);
              }}
              aria-label={`Remove ${o.label}`}
            >
              <X className="h-3 w-3 opacity-70 hover:opacity-100" />
            </button>
          </Badge>
        ))}
        {hiddenCount > 0 && (
          <Badge variant="outline" className="shrink-0">
            +{hiddenCount} more
          </Badge>
        )}
      </div>

      {/* Dialog + simple search icon trigger */}
      <Dialog open={open} onOpenChange={(v) => !disabled && setOpen(v)}>
        <DialogTrigger asChild>
          {selected.length === 0 ? (
            <span className="text-xs text-muted-foreground">{placeholder}</span>
          ) : (
            <div
              role="button"
              aria-label="Open multi-select"
              aria-disabled={disabled || undefined}
              tabIndex={disabled ? -1 : 0}
              onKeyDown={onTriggerKeyDown}
              onClick={() => !disabled && setOpen((p) => !p)}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-9 w-9 shrink-0 items-center justify-center p-0",
                disabled && "pointer-events-none opacity-50"
              )}
            >
              <Search className="h-4 w-4" />
            </div>
          )}
        </DialogTrigger>

        <DialogContent className={cn("p-0 flex flex-col", widthClass)}>
          <DialogHeader className="px-4 pt-4">
            <DialogTitle className="text-base">{title}</DialogTitle>
            {description && (
              <DialogDescription className="text-xs">
                {description}
              </DialogDescription>
            )}
          </DialogHeader>

          {/* Search + list */}
          <div className="px-4 pb-4 flex-1">
            <Command shouldFilter>
              <div className="px-0">
                <CommandInput autoFocus placeholder="Search…" className="h-9" />
              </div>
              <CommandList className="max-h-80 overflow-auto">
                <CommandEmpty>No results.</CommandEmpty>
                <CommandGroup>
                  {options.map((opt) => {
                    const isSelected = selectedSet.has(opt.value);
                    return (
                      <CommandItem
                        key={opt.value}
                        value={`${opt.label} ${opt.value}`}
                        onSelect={() => {
                          toggle(opt.value);
                          // keep open for multi-pick
                        }}
                        className="cursor-pointer"
                      >
                        <div
                          className={cn(
                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border",
                            isSelected && "bg-primary text-primary-foreground"
                          )}
                        >
                          {isSelected && <Check className="h-3 w-3" />}
                        </div>
                        {opt.label}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>

            {/* Optional selected summary inside dialog */}
            {selected.length > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-1">
                {visible.map((o) => (
                  <Badge key={`sel-${o.value}`} variant="secondary">
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
                  <Badge variant="outline">+{hiddenCount} more</Badge>
                )}
              </div>
            )}
          </div>

          {showFooter && (
            <DialogFooter className="gap-2 border-t px-4 py-3">
              <button
                type="button"
                className="text-sm text-muted-foreground hover:underline disabled:opacity-50"
                onClick={clearAll}
                disabled={value.length === 0}
              >
                Clear
              </button>
              <button
                type="button"
                className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:opacity-90"
                onClick={() => setOpen(false)}
              >
                Done
              </button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
