import Link from "next/link";

import { lucia } from "@/lib/auth";
import { ActionResult, Form } from "@/lib/form";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Argon2id } from "oslo/password";
import { db, users } from "@/lib/db";
import { sql } from "drizzle-orm";

export default async function Page() {
  return (
    <main className="min-h-screen relative w-full grid place-items-center">
      <div className="top-0 left-0 w-full h-1/2 bg-gradient-to-b from-primary-500 to-yellow-900 absolute -z-10" />
      <div className="container flex flex-col items-center">
        <h1>Sign in</h1>
        <div className="bg-white rounded-xl w-full p-6 shadow-xl">
          <Form action={signIn}>
            <label htmlFor="username">Username</label>
            <input name="username" id="username" />
            <br />
            <label htmlFor="password">Password</label>
            <input type="password" name="password" id="password" />
            <br />
            <button>Continue</button>
          </Form>
        </div>
        <Link href="/sign-up">Create an account</Link>
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
