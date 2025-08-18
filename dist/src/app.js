"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
exports.app = (0, express_1.default)();
exports.app.use((0, helmet_1.default)());
// cors expects origin to be boolean | string | RegExp | (string | RegExp)[]
// So we check if env.CORS_ORIGIN exists, else fallback to true (allow all)
const allowedOrigins = ['http://localhost:5173', 'https://speaktribe-frontend.vercel.app'];
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
};
exports.app.use((0, cors_1.default)(corsOptions));
exports.app.use(express_1.default.json());
exports.app.get('/health', (_req, res) => res.json({ ok: true, time: new Date().toISOString() }));
exports.app.get("/", (req, res) => {
    res.send("The Backend Server is Live🔥🔥🔥");
    console.log("Server up");
});
exports.app.use("/api/v1", authRoutes_1.default);
// later we'll mount /api/v1/auth, /api/v1/courses, etc.
exports.default = exports.app;
