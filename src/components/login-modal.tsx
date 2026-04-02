"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AnimatePresence, motion } from "framer-motion";

import { dictionary } from "@/lib/i18n";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";
import { useUIStateStore } from "@/lib/stores/ui-state-store";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type FormData = z.infer<typeof schema>;

export function LoginModal() {
  const loginModalOpen = useUIStateStore((s) => s.loginModalOpen);
  const openLoginModal = useUIStateStore((s) => s.openLoginModal);
  const locale = useUIStateStore((s) => s.locale);
  const copy = dictionary[locale];
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "ana@betday.dev", password: "betday123" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const result = await signIn("credentials", {
      ...values,
      redirect: false,
    });
    if (!result?.error) {
      openLoginModal(false);
    }
  });

  return (
    <AnimatePresence>
      {loginModalOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 z-50 bg-overlay'
            onClick={() => openLoginModal(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className='fixed inset-0 z-50 flex items-center justify-center px-4'>
            <Card
              className='w-full max-w-md'
              onClick={(e) => e.stopPropagation()}>
              <Typography variant='h3'>{copy.loginTitle}</Typography>
              <Typography
                variant='body2'
                className='mt-1 text-sm text-tertiary'>
                {copy.loginSubtitle}
              </Typography>

              <Box className='mt-3 rounded-radius-md bg-brand-secondary-soft px-3 py-2'>
                <Typography variant='eyebrow' className='text-link'>
                  {copy.demoCredentials}
                </Typography>
                <Typography
                  variant='body3'
                  className='mt-1 text-xs text-secondary'>
                  ana@betday.dev / betday123
                </Typography>
              </Box>

              <form className='mt-4 space-y-3' onSubmit={onSubmit}>
                <Box className='space-y-1.5'>
                  <label className='text-xs font-semibold text-secondary'>
                    {copy.email}
                  </label>
                  <Input
                    placeholder='ana@betday.dev'
                    type='email'
                    {...form.register("email")}
                  />
                </Box>
                <Box className='space-y-1.5'>
                  <label className='text-xs font-semibold text-secondary'>
                    {copy.password}
                  </label>
                  <Input
                    placeholder='••••••••'
                    type='password'
                    {...form.register("password")}
                  />
                </Box>
                <Box className='flex items-center justify-end gap-2 pt-2'>
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    onClick={() => openLoginModal(false)}>
                    {copy.close}
                  </Button>
                  <Button type='submit' size='sm'>
                    {copy.login}
                  </Button>
                </Box>
              </form>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
