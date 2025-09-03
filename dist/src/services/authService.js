"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = registerUser;
exports.login = login;
exports.sendOtp = sendOtp;
exports.verifyOtp = verifyOtp;
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const date_fns_1 = require("date-fns");
const mailer_1 = require("../utils/mailer");
const prisma = new client_1.PrismaClient();
const SALT_ROUNDS = 10;
if (!process.env.JWT_ACCESS_SECRET) {
    throw new Error("JWT_SECRET is not set in environment variables");
}
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
async function registerUser(email, firstName, lastName, password, role = client_1.Role.STUDENT, displayName) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new Error("User already exists");
    }
    const hashedPassword = await bcrypt_1.default.hash(password, SALT_ROUNDS);
    const user = await prisma.user.create({
        data: {
            email,
            firstName,
            lastName,
            password: hashedPassword,
            displayName,
            role,
        },
    });
    // Remove sensitive fields before returning
    const { password: _, ...safeUser } = user;
    return safeUser;
}
async function login(email, password) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new Error("Invalid credentials");
    }
    const isValid = await bcrypt_1.default.compare(password, user.password);
    if (!isValid) {
        throw new Error("Invalid credentials");
    }
    const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, role: user.role }, JWT_ACCESS_SECRET, { expiresIn: "7d" });
    // Hide password in returned object
    const { password: _, ...safeUser } = user;
    return { user: safeUser, token };
}
async function sendOtp(email) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = (0, date_fns_1.addMinutes)(new Date(), 5);
    await prisma.otpRequest.create({
        data: { email, otp, expiresAt },
    });
    await (0, mailer_1.sendEmail)(email, "Your OTP Code", `Your OTP is ${otp}. It expires in 5 minutes.`);
    return { message: "OTP sent successfully" };
}
async function verifyOtp(email, otp) {
    const otpRecord = await prisma.otpRequest.findFirst({
        where: {
            email,
            otp,
            verified: false,
            expiresAt: { gt: new Date() },
        },
        orderBy: { createdAt: "desc" },
    });
    if (!otpRecord) {
        throw new Error("Invalid or expired OTP");
    }
    await prisma.otpRequest.update({
        where: { id: otpRecord.id },
        data: { verified: true },
    });
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        user = await prisma.user.create({
            data: {
                email,
                firstName: "New",
                lastName: "User",
                password: "",
                role: client_1.Role.STUDENT,
            },
        });
    }
    const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, role: user.role }, JWT_ACCESS_SECRET, { expiresIn: "7d" });
    const { password: _, ...safeUser } = user;
    return { user: safeUser, token };
}
