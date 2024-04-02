import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await validateRequest();
  if (!user) redirect("/sign-in");
  return (
    <>
      <div className="w-full px-3 py-2 shadow-xl">DASHBOARD</div>
      {children}
    </>
  );
}
