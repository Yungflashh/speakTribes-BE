import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { env } from './config/env';

export const app = express();

app.use(helmet());

// cors expects origin to be boolean | string | RegExp | (string | RegExp)[]
// So we check if env.CORS_ORIGIN exists, else fallback to true (allow all)
const corsOrigin = env.CORS_ORIGIN ?? true;

app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true, time: new Date().toISOString() }));

// later we'll mount /api/v1/auth, /api/v1/courses, etc.

export default app;
