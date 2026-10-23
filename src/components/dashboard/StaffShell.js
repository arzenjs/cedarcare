import Link from "next/link";
import { LogOut } from "lucide-react";
import { logoutAction } from "@/app/staff/actions";

export default function StaffShell({ user, title, children }) {
  const links = [
    { href: "/staff/dashboard", label: "Dashboard" },
    { href: "/staff/appointments", label: "Appointments" },
    ...(user.role === "admin" ? [{ href: "/admin", label: "Admin overview" }, { href: "/admin/staff", label: "Staff accounts" }] : []),
  ];
  return (
    <div className="page-width py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
        <nav aria-label="Staff" className="flex flex-wrap gap-1">
          {links.map((l) => <Link key={l.href} href={l.href} className="rounded-md px-3 py-2 text-sm font-medium hover:bg-mist">{l.label}</Link>)}
        </nav>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-muted">{user.name} ({user.role})</span>
          <form action={logoutAction}>
            <button type="submit" className="btn btn-secondary !px-3 !py-1.5 !text-sm"><LogOut size={15} aria-hidden="true" />Sign out</button>
          </form>
        </div>
      </div>
      <h1 className="mt-8 text-4xl text-cedar-dark">{title}</h1>
      <div className="mt-6">{children}</div>
    </div>
  );
}
