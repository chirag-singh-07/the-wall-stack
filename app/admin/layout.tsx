import type React from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Protect admin dashboard: Redirect if not logged in OR not an ADMIN
  if (!session || session.user.role?.toUpperCase() !== "ADMIN") {
    redirect("/login"); // Adjust this to your actual sign-in route
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <main className="lg:pl-64 min-h-screen">{children}</main>
    </div>
  );
}
