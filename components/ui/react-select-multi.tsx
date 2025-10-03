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
    position: "relative",
    zIndex: 1,
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
    border: "1px solid hsl(var(--border))",
    boxShadow: "var(--shadow)",
    backgroundColor: "hsl(var(--background))",
  }),
  menuPortal: (base: any) => ({
    ...base,
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

  // derive objects for react-select from the controlled value prop
  const valueObjects = React.useMemo(
    () => options.filter((o) => value.includes(o.value)),
    [options, value]
  );

  const handleChange = (next: MultiValue<RSOption>) => {
    const arr = Array.isArray(next) ? next.map((o) => o.value) : [];
    console.log("ReactSelectMulti handleChange", arr);
    onChange(arr);
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
      // styles={
      //   stylesOverride ? { ...defaultStyles, ...stylesOverride } : defaultStyles
      // }
      menuPortalTarget={menuPortalTarget}
      menuPosition="fixed"
      menuShouldScrollIntoView={false}
    />
  );
}
