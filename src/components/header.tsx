"use client";

import { getInitials } from "@/lib/functions";
import { User } from "lucia";
import { DarkMode, LightMode, PajamasHamburger } from "./svg";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  User as UserAvatar,
} from "@nextui-org/react";
import { logout } from "@/lib/actions";

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
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <button className="transition-transform grid place-items-center focus-visible:outline-0 p-1.5 focus-visible:bg-neutral-500/25 rounded-xl hover:bg-neutral-500/25 duration-200">
                <Avatar
                  name={user.name}
                  isBordered
                  className="lg:hidden rounded-full"
                  src={user.image}
                />
                <UserAvatar
                  name={user.name}
                  description={user.role}
                  className="max-lg:hidden"
                  avatarProps={{
                    src: user.image,
                    isBordered: true,
                    showFallback: false,
                  }}
                />
              </button>
            </DropdownTrigger>
            <DropdownMenu aria-label="User Actions" variant="flat">
              <DropdownItem key="public-profile" className="h-14 gap-2">
                <p className="font-bold">Inicio de sesion como</p>
                <p className="font-bold">@{user.username}</p>
              </DropdownItem>
              <DropdownItem key="settings">
                Configuracion de cuenta
              </DropdownItem>
              <DropdownItem
                key="logout"
                className="text-danger"
                onAction={async () => await logout()}
                color="danger"
              >
                Cerrar sesion
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          {/* <Link
            href="#"
            className="text-white grid place-items-center p-2 bg-red-500 rounded-full"
          >
            {getInitials(user.name)}
          </Link> */}
        </div>
      </nav>
    </header>
  );
}

/**

 */
