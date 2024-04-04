"use client";

import { getInitials } from "@/lib/functions";
import { User } from "lucia";
import { DarkMode, LightMode, PajamasHamburger } from "./svg";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Header(user: User) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="w-full bg-white dark:bg-neutral-800 py-4 shadow-lg dark:text-neutral-200">
      <nav className="container flex items-center px-5 justify-between">
        <PajamasHamburger className="text-3xl" />
        <div className="flex gap-4 items-center">
          <div className="bg-neutral-300 dark:bg-neutral-900 p-1 flex gap-1 rounded-xl">
            {mounted ? (
              <>
                <button
                  className={`py-0.5 px-2 rounded-lg text-white dark:text-neutral-200 duration-200 ${
                    theme === "light" ? "bg-primary/75" : "bg-transparent"
                  }`}
                  onClick={() => setTheme("light")}
                >
                  <LightMode />
                </button>
                <button
                  className={`py-0.5 px-2 rounded-lg text-neutral-400 dark:text-black duration-200 ${
                    theme === "dark" ? "bg-primary/75" : "bg-transparent"
                  }`}
                  onClick={() => setTheme("dark")}
                >
                  <DarkMode />
                </button>
              </>
            ) : (
              <>
                <button className="py-0.5 px-2 rounded-lg text-neutral-400 dark:text-neutral-200">
                  <LightMode />
                </button>
                <button className="py-0.5 px-2 rounded-lg text-neutral-400 dark:text-neutral-200">
                  <DarkMode />
                </button>
              </>
            )}
          </div>
          <Link
            href="#"
            className="text-white grid place-items-center p-2 bg-red-500 rounded-full"
          >
            {getInitials(user.name)}
          </Link>
        </div>
      </nav>
    </header>
  );
}
