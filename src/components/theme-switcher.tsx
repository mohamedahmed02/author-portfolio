"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

const options = [
  {
    value: "light",
    icon: Sun,
    labelKey: "themeLight" as const,
  },
  {
    value: "dark",
    icon: Moon,
    labelKey: "themeDark" as const,
  },
  {
    value: "system",
    icon: Monitor,
    labelKey: "themeSystem" as const,
  },
];

const emptySubscribe = () => () => {};

export function ThemeSwitcher({
  labels,
  className,
}: {
  labels: {
    themeLight: string;
    themeDark: string;
    themeSystem: string;
    theme: string;
  };
  className?: string;
}) {
  const { theme, setTheme } = useTheme();

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  if (!mounted) {
    return (
      <div
        className={cn("h-8 w-[6.5rem]", className)}
        aria-hidden
      />
    );
  }

  return (
    <div
      role="group"
      aria-label={labels.theme}
      className={cn(
        "inline-flex items-center gap-0.5 border border-[var(--border)] p-0.5",
        className,
      )}
    >
      {options.map(({ value, icon: Icon, labelKey }) => {
        const active = theme === value;

        return (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            className={cn(
              "relative inline-flex h-7 w-8 items-center justify-center transition-colors duration-200",
              active
                ? "bg-[var(--fg)] text-[var(--bg)]"
                : "text-[var(--fg-subtle)] hover:bg-[var(--bg-elevated)] hover:text-[var(--fg)]",
            )}
            aria-label={labels[labelKey]}
            aria-pressed={active}
            title={labels[labelKey]}
          >
            <Icon
              className="h-3.5 w-3.5"
              strokeWidth={1.7}
            />
          </button>
        );
      })}
    </div>
  );
}