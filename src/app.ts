import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { env } from './config/env';
import authRoutes from "./routes/authRoutes"

export const app = express();

app.use(helmet());



// cors expects origin to be boolean | string | RegExp | (string | RegExp)[]
// So we check if env.CORS_ORIGIN exists, else fallback to true (allow all)

const allowedOrigins = ['http://localhost:5173', 'https://speaktribe-frontend.vercel.app'];

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true, time: new Date().toISOString() }));

app.get("/", (req,res)=>{
    res.send("The Backend Server is Live🔥🔥🔥")
    console.log("Server up");
    
})

app.use("/api/v1", authRoutes)

// later we'll mount /api/v1/auth, /api/v1/courses, etc.

export default app;
