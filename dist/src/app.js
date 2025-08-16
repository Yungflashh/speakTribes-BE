"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const env_1 = require("./config/env");
exports.app = (0, express_1.default)();
exports.app.use((0, helmet_1.default)());
// cors expects origin to be boolean | string | RegExp | (string | RegExp)[]
// So we check if env.CORS_ORIGIN exists, else fallback to true (allow all)
const corsOrigin = env_1.env.CORS_ORIGIN ?? true;
exports.app.use((0, cors_1.default)({ origin: corsOrigin, credentials: true }));
exports.app.use(express_1.default.json());
exports.app.get('/health', (_req, res) => res.json({ ok: true, time: new Date().toISOString() }));
// later we'll mount /api/v1/auth, /api/v1/courses, etc.
exports.default = exports.app;
