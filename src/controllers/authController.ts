import { Request, Response } from "express";
import * as authService from "../services/authService";
import { Role } from "@prisma/client";

export async function register(req: Request, res: Response) {
  try {
    const { email, firstName, lastName, password, role, displayName } = req.body;

    if (!email || !firstName || !lastName || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = await authService.registerUser(
      email,
      firstName,
      lastName,
      password,
      role || Role.STUDENT,
      displayName
    );

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Registration failed" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const { user, token } = await authService.login(email, password);

    res.status(200).json({ message: "Login successful", user, token });
  } catch (error: any) {
    res.status(401).json({ message: error.message || "Login failed" });
  }
}

export async function sendOtp(req: Request, res: Response) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const result = await authService.sendOtp(email);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Failed to send OTP" });
  }
}

export async function verifyOtp(req: Request, res: Response) {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const result = await authService.verifyOtp(email, otp);
    res.status(200).json({ message: "OTP verified", ...result });
  } catch (error: any) {
    res.status(400).json({ message: error.message || "OTP verification failed" });
  }
}


