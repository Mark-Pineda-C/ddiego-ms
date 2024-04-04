import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const { user } = await validateRequest();
  if (user.role !== "superadmin") redirect("/dashboard");
  return <span>asd</span>;
}
