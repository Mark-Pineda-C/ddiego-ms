import Link from "next/link";

import { lucia } from "@/lib/auth";
import { ActionResult, Form } from "@/lib/form";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Argon2id } from "oslo/password";
import { db, users } from "@/lib/db";
import { sql } from "drizzle-orm";

import Image from "next/image";
import Logo from "@/assets/logo_icon.png";
import { LogoAlt } from "@/components/svg";
import StatusBarColorChanger from "@/components/status-bar-color-changer";

export default async function Page() {
  StatusBarColorChanger({ color: { light: "#ffffff", dark: "#000000" } });

  return (
    <main className="min-h-screen relative w-full grid place-items-center dark:text-neutral-200">
      <div className="top-0 left-0 w-full h-1/2 bg-gradient-to-b from-primary to-secondary absolute -z-10 lg:bg-gradient-to-br" />
      <div className="container flex flex-col items-center gap-10">
        <Image
          src={Logo}
          alt="logo"
          width={120}
          height={120}
          className="lg:hidden dark:invert"
        />

        <div className="bg-white/50 rounded-xl w-full p-6 shadow-xl dark:bg-neutral-900/50 relative overflow-hidden border border-white/25 dark:border-neutral-900/25">
          <div className="absolute top-0 left-0 w-full h-full z-0 backdrop-blur-lg"></div>
          <Form action={signIn}>
            <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 relative z-10">
              <div className="flex flex-col gap-1 lg:gap-2 items-start">
                <LogoAlt className="text-3xl text-primary max-lg:hidden" />
                <h1 className="font-bold text-lg">Inicio de sesión</h1>
                <p className="text-sm">
                  Ingresa tus credenciales para acceder a la plataforma interna
                  del sistema
                </p>
              </div>
              <div className="flex flex-col gap-3 items-center lg:items-start">
                <div className="flex flex-col gap-1 w-full">
                  <label htmlFor="username" className="font-bold text-sm">
                    Usuario
                  </label>
                  <input
                    name="username"
                    id="username"
                    aria-autocomplete="none"
                    autoComplete="none"
                    autoCapitalize="none"
                    className="focus-visible:ring-0 rounded-xl bg-neutral-500/25 dark:bg-neutral-300/25 p-2 outline-primary border-none"
                  />
                </div>
                <div className="flex flex-col gap-1 w-full">
                  <label htmlFor="password" className="font-bold text-sm">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    className="focus-visible:ring-0 rounded-xl bg-neutral-500/25 dark:bg-neutral-300/25 p-2 outline-primary border-none"
                  />
                </div>
                <button className="py-1 px-6 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-medium uppercase tracking-widest dark:text-black">
                  ingresar
                </button>
                <p className="text-center">Olvidaste tu contraseña?</p>
              </div>
            </div>
            {/* <div className="flex flex-col gap-3 items-center">
              <LogoAlt className="text-3xl text-primary-500 hidden" />
              <div className="space-y-1 w-full">
                <h1 className="font-bold text-lg">Inicio de sesión</h1>
                <p className="text-sm">
                  Ingresa tus credenciales para acceder a la plataforma interna
                  del sistema
                </p>
              </div>
              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="username" className="font-bold text-sm">
                  Usuario
                </label>
                <input
                  name="username"
                  id="username"
                  className="focus-visible:ring-0 rounded-xl bg-neutral-500/25 p-2 outline-primary-500"
                />
              </div>
              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="password" className="font-bold text-sm">
                  Contraseña
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  className="focus-visible:ring-0 rounded-xl bg-neutral-500/25 p-2 outline-primary-500"
                />
              </div>
              <button className="py-1 px-6 bg-gradient-to-r from-primary-700 to-primary-500 text-white rounded-xl font-medium uppercase tracking-widest">
                ingresar
              </button>
              <p className="text-center">Olvidaste tu contraseña?</p>
            </div> */}
          </Form>
        </div>
      </div>
    </main>
  );
}

async function signIn(_: any, formData: FormData): Promise<ActionResult> {
  "use server";
  const username = formData.get("username");
  if (
    typeof username !== "string" ||
    username.length < 3 ||
    username.length > 31 ||
    !/^[a-zA-Z0-9\._-]+$/.test(username)
  ) {
    return {
      error: "Invalid username",
    };
  }
  const password = formData.get("password");
  if (
    typeof password !== "string" ||
    password.length < 6 ||
    password.length > 255
  ) {
    return {
      error: "Invalid password",
    };
  }

  const existingUser = await db
    .select({
      id: users.id,
      username: users.username,
      password: users.hashedPassword,
    })
    .from(users)
    .where(sql<string>`username = ${username}`);
  if (!existingUser[0]) {
    return {
      error: "Incorrect username or password",
    };
  }

  const validPassword = await new Argon2id().verify(
    existingUser[0].password,
    password
  );
  if (!validPassword) {
    return {
      error: "Incorrect username or password",
    };
  }

  const session = await lucia.createSession(existingUser[0].id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return redirect("/");
}
