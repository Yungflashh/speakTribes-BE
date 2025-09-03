"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = sendEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("EMAIL_USER and EMAIL_PASS must be set");
}
const transporter = nodemailer_1.default.createTransport({
    service: "gmail", // or any SMTP service like SendGrid
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
async function sendEmail(to, subject, text) {
    await transporter.sendMail({
        from: `"MyApp" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
    });
}
