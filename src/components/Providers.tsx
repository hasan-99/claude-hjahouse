"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import CommandPalette from "./CommandPalette";

/* ---- Theme ---- */
type Theme = "light" | "dark";
interface ThemeCtx {
  theme: Theme;
  mounted: boolean;
  toggle: () => void;
}
const ThemeContext = createContext<ThemeCtx>({
  theme: "light",
  mounted: false,
  toggle: () => {},
});
export const useTheme = () => useContext(ThemeContext);

/* ---- Command palette (Ctrl/Cmd+K) ---- */
interface PaletteCtx {
  open: boolean;
  setOpen: (v: boolean) => void;
  toggle: () => void;
}
const PaletteContext = createContext<PaletteCtx>({
  open: false,
  setOpen: () => {},
  toggle: () => {},
});
export const useCommandPalette = () => useContext(PaletteContext);

export default function Providers({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTheme(
      document.documentElement.classList.contains("dark") ? "dark" : "light"
    );
  }, []);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      const root = document.documentElement;
      root.classList.toggle("dark", next === "dark");
      root.style.colorScheme = next;
      try {
        localStorage.setItem("theme", next);
      } catch {}
      return next;
    });
  }, []);

  const togglePalette = useCallback(() => setOpen((o) => !o), []);

  // Global Ctrl/Cmd+K to open search.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, mounted, toggle }}>
      <PaletteContext.Provider value={{ open, setOpen, toggle: togglePalette }}>
        {children}
        <CommandPalette />
      </PaletteContext.Provider>
    </ThemeContext.Provider>
  );
}
