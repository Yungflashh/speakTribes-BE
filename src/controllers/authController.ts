import { Request, Response } from 'express';
import * as authService from '../services/authService';
import { registerSchema, loginSchema } from '../schemas/authSchemas';

export async function register(req: Request, res: Response) {
  try {
    const parsed = registerSchema.parse(req.body);
    const user = await authService.registerUser(parsed.email, parsed.firstName, parsed.lastName, parsed.password, parsed.displayName);
    res.status(201).json({ user });
  } catch (error: any) {
    if (error?.issues) {
      // zod validation errors
      return res.status(400).json({ errors: error.issues });
    }
    res.status(400).json({ error: error.message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const parsed = loginSchema.parse(req.body);
    const { user, token } = await authService.login(parsed.email, parsed.password);
    res.json({ user, token });
  } catch (error: any) {
    if (error?.issues) {
      return res.status(400).json({ errors: error.issues });
    }
    res.status(401).json({ error: error.message });
  }
}
