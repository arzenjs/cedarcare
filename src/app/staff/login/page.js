import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/access";
import LoginForm from "@/components/dashboard/LoginForm";

export const metadata = { title: "Staff sign in" };

export default async function LoginPage({ searchParams }) {
  const user = await getCurrentUser();
  if (user) redirect(user.role === "admin" ? "/admin" : "/staff/dashboard");
  const { expired } = await searchParams;

  return (
    <div className="page-width max-w-md py-20">
      <h1 className="text-4xl text-cedar-dark">Staff sign in</h1>
      <p className="mt-2 mb-8 text-muted">For CedarCare clinic staff. Accounts are created by invitation only.</p>
      <LoginForm expired={!!expired} />
    </div>
  );
}
