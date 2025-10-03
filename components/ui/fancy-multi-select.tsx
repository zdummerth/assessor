// app/components/ui/fancy-multi-select.tsx
"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";

export type RSOption = { value: string; label: string };

type Props = {
  options: RSOption[];
  value: string[]; // controlled selection (array of values)
  onChange: (next: string[]) => void;
  placeholder?: string;
  className?: string;
  instanceId?: string; // (kept for parity; not used by cmdk)
  disabled?: boolean;
};

export default function FancyMultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select…",
  className,
  disabled,
}: Props) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  // Derived selections as full option objects (for badges)
  const selected = React.useMemo(
    () => options.filter((o) => value.includes(o.value)),
    [options, value]
  );

  const handleUnselect = (val: string) => {
    if (disabled) return;
    onChange(value.filter((v) => v !== val));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current;
    if (!input || disabled) return;

    if ((e.key === "Delete" || e.key === "Backspace") && input.value === "") {
      // remove last chip
      if (value.length > 0) {
        onChange(value.slice(0, -1));
      }
    }
    if (e.key === "Escape") {
      input.blur();
      setOpen(false);
    }
  };

  const lower = inputValue.trim().toLowerCase();
  const selectedSet = React.useMemo(() => new Set(value), [value]);

  // Filter out already-selected & apply text filter
  const selectables = React.useMemo(
    () =>
      options.filter(
        (o) =>
          !selectedSet.has(o.value) &&
          (lower === "" ||
            o.label.toLowerCase().includes(lower) ||
            o.value.toLowerCase().includes(lower))
      ),
    [options, selectedSet, lower]
  );

  return (
    <Command
      onKeyDown={handleKeyDown}
      className={`overflow-visible bg-transparent ${className ?? ""}`}
    >
      <div
        className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
        aria-disabled={disabled}
      >
        <div className="flex flex-wrap gap-1">
          {selected.map((opt) => (
            <Badge key={opt.value} variant="secondary" className="select-none">
              {opt.label}
              {!disabled && (
                <button
                  type="button"
                  className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => handleUnselect(opt.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleUnselect(opt.value);
                  }}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </Badge>
          ))}

          {/* Input (no search icon) */}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={(v) => {
              setInputValue(v);
              if (!open) setOpen(true);
            }}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            disabled={disabled}
            className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Dropdown */}
      <div className="relative mt-2">
        <CommandList>
          {open && !disabled && selectables.length > 0 ? (
            <div
              className="absolute top-0 z-50 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in"
              style={{ maxHeight: 280, overflow: "auto" }}
            >
              <CommandGroup>
                {selectables.map((opt) => (
                  <CommandItem
                    key={opt.value}
                    value={opt.value}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onSelect={() => {
                      setInputValue("");
                      onChange([...value, opt.value]);
                      // keep open for more picks
                      setOpen(true);
                      // refocus input for rapid entry
                      inputRef.current?.focus();
                    }}
                    className="cursor-pointer"
                  >
                    {opt.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </div>
          ) : null}
        </CommandList>
      </div>
    </Command>
  );
}
