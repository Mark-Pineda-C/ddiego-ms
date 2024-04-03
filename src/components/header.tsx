"use client";

import { getInitials } from "@/lib/functions";
import { User } from "lucia";
import { PajamasHamburger } from "./svg";
import Link from "next/link";

export default function Header(user: User) {
  return (
    <header className="w-full bg-white dark:bg-neutral-800 py-4 shadow-lg dark:text-neutral-200">
      <nav className="container flex items-center px-5 justify-between">
        <PajamasHamburger className="text-3xl" />
        <Link
          href="#"
          className="text-white grid place-items-center p-2 bg-red-500 rounded-full"
        >
          {getInitials(user.name)}
        </Link>
      </nav>
    </header>
  );
}
