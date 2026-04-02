import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { LoginForm } from "@/components/login-form";
import { Typography } from "@/components/ui/typography";
import { authOptions } from "@/lib/auth";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session?.user?.id) {
    redirect("/");
  }

  return (
    <main className="flex min-h-[80vh] items-center justify-center px-4 py-8">
      <section className="mx-auto w-full max-w-md rounded-radius-xl border border-line-primary bg-surface-primary p-6 shadow-sm md:p-8">
        <Typography variant="h1" className="font-bold text-primary lg:text-4xl">
          Acceder a BetDay
        </Typography>
        <Typography variant="body2" className="mt-2">
          Ingresa con tu cuenta para continuar.
        </Typography>

        <div className="mt-8">
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
