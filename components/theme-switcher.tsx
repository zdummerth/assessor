"use client";

import { Fragment, useEffect, useState } from "react";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { useTheme } from "next-themes";
// import { Button } from "@/components/ui/button";
import { Sun, Moon, Laptop } from "lucide-react";

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // only render client‑side
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const ICON_SIZE = 16;
  const items = [
    { value: "light", label: "Light", Icon: Sun },
    { value: "dark", label: "Dark", Icon: Moon },
    { value: "system", label: "System", Icon: Laptop },
  ] as const;

  return (
    <Menu as="div" className="relative text-left">
      <MenuButton as="div" className="flex items-center justify-center">
        <button>
          {theme === "light" ? (
            <Sun size={ICON_SIZE} className="text-muted-foreground" />
          ) : theme === "dark" ? (
            <Moon size={ICON_SIZE} className="text-muted-foreground" />
          ) : (
            <Laptop size={ICON_SIZE} className="text-muted-foreground" />
          )}
        </button>
      </MenuButton>

      <MenuItems className="absolute right-0 mt-2 w-36 origin-top-right rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 p-1 shadow-lg focus:outline-none z-50">
        {items.map(({ value, label, Icon }) => (
          <MenuItem key={value}>
            <button
              onClick={() => setTheme(value)}
              className={`
                  group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm
                  ${theme === value ? "font-semibold" : "font-normal"}
                `}
            >
              <Icon size={ICON_SIZE} className="text-muted-foreground" />
              {label}
            </button>
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  );
};

export { ThemeSwitcher };
