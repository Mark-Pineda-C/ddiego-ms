import Header from "@/components/header";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Providers } from "../providers";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await validateRequest();
  if (!user) redirect("/sign-in");
  return (
    <Providers>
      <Header {...user} />
      {children}
    </Providers>
  );
}
