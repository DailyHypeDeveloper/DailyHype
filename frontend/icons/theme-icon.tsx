"use client";

import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import { useTheme } from "next-themes";

export default function ThemeIcon({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  return <>{theme === "dark" ? <MoonIcon className={clsx("", className)} onClick={() => setTheme("light")} /> : <SunIcon className={clsx("", className)} onClick={() => setTheme("dark")} />}</>;
}
