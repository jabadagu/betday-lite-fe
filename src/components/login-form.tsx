"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { loginSchema } from "@/lib/schemas";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors: fieldErrors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "ana@betday.dev",
      password: "betday123",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setError(null);

    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
      callbackUrl,
    });

    if (result?.error) {
      setError("Credenciales invalidas");
      return;
    }

    router.push(callbackUrl);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <Box>
        <label
          className='mb-1 block text-sm font-semibold text-primary'
          htmlFor='email'>
          Email
        </label>
        <Input
          id='email'
          type='email'
          variant={fieldErrors.email ? "error" : "default"}
          {...register("email")}
        />
        {fieldErrors.email && (
          <Typography
            variant='body3'
            className='mt-1 text-xs text-status-error'>
            {fieldErrors.email.message}
          </Typography>
        )}
      </Box>
      <Box>
        <label
          className='mb-1 block text-sm font-semibold text-primary'
          htmlFor='password'>
          Password
        </label>
        <Input
          id='password'
          type='password'
          variant={fieldErrors.password ? "error" : "default"}
          {...register("password")}
        />
        {fieldErrors.password && (
          <Typography
            variant='body3'
            className='mt-1 text-xs text-status-error'>
            {fieldErrors.password.message}
          </Typography>
        )}
      </Box>

      {error ? (
        <Typography
          variant='body3'
          className='text-sm font-medium text-status-error'>
          {error}
        </Typography>
      ) : null}

      <Button
        type='submit'
        className='w-full'
        disabled={isSubmitting}
        isLoading={isSubmitting}>
        {isSubmitting ? "Ingresando..." : "Ingresar"}
      </Button>
    </form>
  );
}
