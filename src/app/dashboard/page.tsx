import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const { user } = await validateRequest();
  if (!user) redirect("/sign-in");

  return (
    <div className="dark:text-neutral-200">
      <h1>Dashboard</h1>
      <p>Welcome {user.name}</p>
      <p>Oficina {user.office ?? "<sin oficina>"}</p>
      <p>Rol {user.role}</p>
    </div>
  );
}
