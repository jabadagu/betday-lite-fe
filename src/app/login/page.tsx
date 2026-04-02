import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { LoginForm } from "@/components/login-form";
import { Typography } from "@/components/ui/typography";
import { authOptions, demoUsers } from "@/lib/auth";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session?.user?.id) {
    redirect("/");
  }

  return (
    <section className='mx-auto max-w-md rounded-radius-xl border border-line-primary bg-surface-primary p-6 shadow-sm md:p-8'>
      <Typography variant='h1'>Acceder a BetDay</Typography>
      <Typography variant='body2' className='mt-2'>
        Usa uno de los usuarios demo para probar.
      </Typography>

      <div className='mt-4 rounded-radius-lg border border-line-primary bg-brand-secondary-soft p-3 text-sm text-secondary'>
        <Typography variant='body2' className='font-semibold text-primary'>
          Credenciales demo
        </Typography>
        {demoUsers.map((user) => (
          <Typography variant='body3' key={user.id}>
            {user.email} / {user.password}
          </Typography>
        ))}
      </div>

      <div className='mt-6'>
        <LoginForm />
      </div>
    </section>
  );
}
