import bcrypt from "bcrypt";
import { PrismaClient, Role } from "@prisma/client";
import jwt from "jsonwebtoken";
import { addMinutes } from "date-fns";
import { sendEmail } from "../utils/mailer";

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

if (!process.env.JWT_ACCESS_SECRET) {
  throw new Error("JWT_SECRET is not set in environment variables");
}
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

export async function registerUser(
  email: string,
  firstName: string,
  lastName: string,
  password: string,
  role: Role = Role.STUDENT,
  displayName?: string
) {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

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

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    JWT_ACCESS_SECRET!,
    { expiresIn: "7d" }
  );

  // Hide password in returned object
  const { password: _, ...safeUser } = user;
  return { user: safeUser, token };
}



export async function sendOtp(email: string) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = addMinutes(new Date(), 5);

  await prisma.otpRequest.create({
    data: { email, otp, expiresAt },
  });

  await sendEmail(
    email,
    "Your OTP Code",
    `Your OTP is ${otp}. It expires in 5 minutes.`
  );

  return { message: "OTP sent successfully" };
}

export async function verifyOtp(email: string, otp: string) {
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
        role: Role.STUDENT,
      },
    });
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    JWT_ACCESS_SECRET!,
    { expiresIn: "7d" }
  );

  const { password: _, ...safeUser } = user;
  return { user: safeUser, token };
}
