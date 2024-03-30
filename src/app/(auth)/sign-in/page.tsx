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

export default async function Page() {
  return (
    <main className="min-h-screen relative w-full grid place-items-center">
      <div className="top-0 left-0 w-full h-1/2 bg-gradient-to-b from-primary-500 to-yellow-900 absolute -z-10" />
      <div className="container flex flex-col items-center gap-10">
        <Image
          src={Logo}
          alt="logo"
          width={120}
          height={120}
          className="lg:hidden"
        />

        <div className="bg-white rounded-xl w-full p-6 shadow-xl">
          <Form action={signIn}>
            <div className="flex flex-col gap-3 items-center">
              <div className="space-y-1">
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
                  className="border rounded-xl bg-neutral-300 p-2 outline-primary-500"
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
                  className="border rounded-xl bg-neutral-300 p-2 outline-primary-500"
                />
              </div>
              <button className="py-1 px-6 bg-gradient-to-r from-primary-500 to-primary-400 text-white rounded-xl font-medium uppercase tracking-widest">
                continuar
              </button>
              <p className="text-center">Olvidaste tu contraseña?</p>
            </div>
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
