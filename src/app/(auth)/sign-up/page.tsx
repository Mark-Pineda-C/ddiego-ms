import { ActionResult, Form } from "@/lib/form";
import { Argon2id } from "oslo/password";
import { generateId } from "lucia";
import { db, userTable } from "@/lib/db";
import { lucia, validateRequest } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
  const { user } = await validateRequest();
  if (user) {
    return redirect("/");
  }
  return (
    <section>
      <h1>Registrate</h1>
      <br />
      <br />
      <Form action={signUp}>
        <div className="flex gap-4">
          <label htmlFor="name">Full Name</label>
          <input className="!bg-neutral-800 text-white" name="name" id="name" />
        </div>
        <br />
        <div className="flex gap-4">
          <label htmlFor="username">Username</label>
          <input
            className="!bg-neutral-800 text-white"
            name="username"
            id="username"
          />
        </div>
        <br />
        <div className="flex gap-4">
          <label htmlFor="password">Password</label>
          <input
            className="!bg-neutral-800 text-white"
            type="password"
            name="password"
            id="password"
          />
        </div>
        <br />
        <button>Continue</button>
      </Form>
    </section>
  );
}

async function signUp(_: any, formData: FormData): Promise<ActionResult> {
  "use server";
  const username = formData.get("username");
  if (
    typeof username !== "string" ||
    username.length < 3 ||
    username.length > 31 ||
    !/^[a-zA-Z0-9_-]+$/.test(username)
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
  const name = formData.get("name");
  if (!name || typeof name !== "string" || name.length < 1) {
    return {
      error: "Invalid name",
    };
  }

  const hashedPassword = await new Argon2id().hash(password);
  const userId = generateId(15);

  try {
    db.insert(userTable).values({ id: userId, name, username, hashedPassword });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
  } catch (e) {
    console.log(e);
    return {
      error: "Unknown error",
    };
  }
  return { error: null };
}
