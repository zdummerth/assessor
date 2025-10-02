"use client";

import * as React from "react";
import Select, { type MultiValue } from "react-select";

export type RSOption = { value: string; label: string };

type ReactSelectMultiProps = {
  options: RSOption[];
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  className?: string;
  instanceId?: string;
  isDisabled?: boolean;
  closeMenuOnSelect?: boolean;
  hideSelectedOptions?: boolean;
  stylesOverride?: any;
};

const defaultStyles = {
  control: (base: any) => ({
    ...base,
    minHeight: 32,
    height: "auto",
    borderColor: "hsl(var(--border))",
    backgroundColor: "transparent",
    boxShadow: "none",
    ":hover": { borderColor: "hsl(var(--border))" },
  }),
  valueContainer: (base: any) => ({ ...base, padding: "2px 8px" }),
  indicatorsContainer: (base: any) => ({ ...base, height: 28 }),
  dropdownIndicator: (base: any) => ({ ...base, padding: 4 }),
  clearIndicator: (base: any) => ({ ...base, padding: 4 }),
  multiValue: (base: any) => ({
    ...base,
    backgroundColor: "hsl(var(--secondary))",
    color: "hsl(var(--secondary-foreground))",
  }),
  multiValueLabel: (base: any) => ({
    ...base,
    fontSize: 12,
    color: "hsl(var(--secondary-foreground))",
  }),
  multiValueRemove: (base: any) => ({
    ...base,
    ":hover": {
      backgroundColor: "transparent",
      color: "hsl(var(--foreground))",
    },
  }),
  menu: (base: any) => ({
    ...base,
    zIndex: 50,
    border: "1px solid hsl(var(--border))",
    boxShadow: "var(--shadow)",
    backgroundColor: "hsl(var(--background))",
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isFocused ? "hsl(var(--muted))" : "transparent",
    color: "hsl(var(--foreground))",
  }),
} as const;

export default function ReactSelectMulti({
  options,
  value,
  onChange,
  placeholder = "Select…",
  className,
  instanceId,
  isDisabled,
  closeMenuOnSelect = false,
  hideSelectedOptions = false,
  stylesOverride,
}: ReactSelectMultiProps) {
  const menuPortalTarget =
    typeof document !== "undefined" ? document.body : undefined;

  // Authoritative base comes from `value`, optimistic patches applied on top
  const [optimisticValues, addOptimistic] = React.useOptimistic<
    string[],
    string[]
  >(value ?? [], (_curr, next) => next);

  // Transition for optimistic updates (required by React)
  const [isPending, startTransition] = React.useTransition();

  const valueObjects = React.useMemo(
    () => options.filter((o) => optimisticValues.includes(o.value)),
    [options, optimisticValues]
  );

  const handleChange = (next: MultiValue<RSOption>) => {
    const arr = Array.isArray(next) ? next.map((o) => o.value) : [];

    // ✅ Wrap optimistic update in a transition
    startTransition(() => {
      addOptimistic(arr);
      // (Optional) also wrap parent onChange if it’s heavy (URL updates, etc.)
      onChange(arr);
    });
  };

  return (
    <Select
      className={className}
      classNamePrefix="rs"
      instanceId={instanceId}
      isMulti
      isDisabled={isDisabled}
      options={options}
      value={valueObjects}
      onChange={handleChange}
      placeholder={placeholder}
      closeMenuOnSelect={closeMenuOnSelect}
      hideSelectedOptions={hideSelectedOptions}
      styles={stylesOverride ?? defaultStyles}
      menuPortalTarget={menuPortalTarget}
      // You can show pending UI if you want:
      // isLoading={isPending}
    />
  );
}
