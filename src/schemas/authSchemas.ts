import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  firstName : z.string(),
  lastName : z.string(),
  password: z.string().min(6),
  displayName: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
