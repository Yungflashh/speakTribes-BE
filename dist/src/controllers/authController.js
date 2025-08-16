"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
const authService = __importStar(require("../services/authService"));
const authSchemas_1 = require("../schemas/authSchemas");
async function register(req, res) {
    try {
        const parsed = authSchemas_1.registerSchema.parse(req.body);
        const user = await authService.registerUser(parsed.email, parsed.firstName, parsed.lastName, parsed.password, parsed.displayName);
        res.status(201).json({ user });
    }
    catch (error) {
        if (error?.issues) {
            // zod validation errors
            return res.status(400).json({ errors: error.issues });
        }
        res.status(400).json({ error: error.message });
    }
}
async function login(req, res) {
    try {
        const parsed = authSchemas_1.loginSchema.parse(req.body);
        const { user, token } = await authService.login(parsed.email, parsed.password);
        res.json({ user, token });
    }
    catch (error) {
        if (error?.issues) {
            return res.status(400).json({ errors: error.issues });
        }
        res.status(401).json({ error: error.message });
    }
}
