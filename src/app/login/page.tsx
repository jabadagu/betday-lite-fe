import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { LoginForm } from "@betday/components/login-form";
import { Typography } from "@betday/components/ui";
import { authOptions } from "@betday/lib/auth";

export const metadata: Metadata = {
  title: "Iniciar sesion | BetDay",
  description: "Accede a BetDay para continuar con tu experiencia.",
  robots: {
    index: false,
    follow: false,
  },
};

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
