import { z } from "zod";

export const placeBetSchema = z.object({
  stake: z.number().min(1).max(50000),
});

export const loginSchema = z.object({
  email: z.email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});
