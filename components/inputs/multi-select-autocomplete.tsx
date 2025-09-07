"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  label?: string;
  options: string[]; // all possible values
  value: string[]; // selected codes
  onChange: (next: string[]) => void;
  placeholder?: string;
  className?: string;
};

export default function MultiSelectAutocomplete({
  label = "Land Uses",
  options,
  value,
  onChange,
  placeholder = "Search land uses…",
  className = "",
}: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter & sort: put selected at top
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    const arr = q
      ? options.filter((o) => o?.toLowerCase().includes(q))
      : options.slice();
    const sel = new Set(value);
    return arr.sort((a, b) => {
      const sa = sel.has(a) ? 0 : 1;
      const sb = sel.has(b) ? 0 : 1;
      if (sa !== sb) return sa - sb;
      return a.localeCompare(b);
    });
  }, [options, query, value]);

  function toggle(opt: string) {
    if (value.includes(opt)) {
      onChange(value.filter((v) => v !== opt));
    } else {
      onChange([...value, opt]);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter")) {
      setOpen(true);
      return;
    }
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, Math.max(filtered.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const opt = filtered[highlight];
      if (opt) toggle(opt);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  // Close dropdown on blur (when clicking outside)
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && <div className="text-sm mb-1">{label}</div>}

      {/* Selected chips */}
      {value.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {value.map((v) => (
            <span
              key={v}
              className="inline-flex items-center gap-2 rounded-full bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 text-xs"
            >
              {v}
              <button
                type="button"
                className="text-blue-600 hover:text-blue-800"
                onClick={() => toggle(v)}
                aria-label={`Remove ${v}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="relative">
        <input
          type="text"
          className="w-full rounded-md border px-2 py-1 text-sm pr-16"
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
        />

        {/* Clear button */}
        {query && (
          <button
            type="button"
            className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={() => {
              setQuery("");
              setOpen(false);
            }}
            aria-label="Clear"
          >
            ✕
          </button>
        )}

        {/* Toggle button */}
        <button
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle options"
        >
          ▾
        </button>
      </div>

      {/* Dropdown */}
      {open && (
        <ul
          className="absolute z-10 mt-1 max-h-64 w-full overflow-auto rounded-md border bg-white shadow"
          role="listbox"
        >
          {filtered.length === 0 ? (
            <li className="px-3 py-2 text-sm text-gray-500">No matches</li>
          ) : (
            filtered.map((opt, idx) => {
              const selected = value.includes(opt);
              return (
                <li
                  key={opt}
                  role="option"
                  aria-selected={selected}
                  className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer ${
                    idx === highlight ? "bg-gray-100" : ""
                  }`}
                  onMouseEnter={() => setHighlight(idx)}
                  onMouseDown={(e) => {
                    e.preventDefault(); // prevent blur
                    toggle(opt);
                  }}
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4"
                    readOnly
                    checked={selected}
                  />
                  <span>{opt}</span>
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}
