import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    // 1. Create a Bank Branch
    const bankBranch = await prisma.branch.create({
      data: {
        name: "Global Trust Bank",
        location: "Financial District",
        description: "Main central branch for comprehensive financial services.",
        workingHours: "09:00 - 17:00",
        queueLimit: 200,
        services: {
          create: [
            { name: "Account Opening", avgDuration: 20 },
            { name: "Cash Deposit/Withdrawal", avgDuration: 5 },
            { name: "Loan Consultation", avgDuration: 30 }
          ]
        }
      }
    });

    // 2. Create a Hospital Branch
    const hospitalBranch = await prisma.branch.create({
      data: {
        name: "CityCare General Hospital",
        location: "Medical City",
        description: "Primary healthcare and specialized treatments.",
        workingHours: "24/7",
        queueLimit: 500,
        services: {
          create: [
            { name: "General Checkup", avgDuration: 15 },
            { name: "Pediatrics", avgDuration: 20 },
            { name: "Orthopedics", avgDuration: 25 },
            { name: "Emergency / Triage", avgDuration: 10 }
          ]
        }
      }
    });

    // 3. Create Admins for them
    const password = await bcrypt.hash("admin123", 10);

    const bankAdmin = await prisma.user.create({
      data: {
        name: "Bank Admin",
        email: "bank@intelliqueue.com",
        password,
        role: "ADMIN",
        branchId: bankBranch.id
      }
    });

    const hospitalAdmin = await prisma.user.create({
      data: {
        name: "Hospital Admin",
        email: "hospital@intelliqueue.com",
        password,
        role: "ADMIN",
        branchId: hospitalBranch.id
      }
    });

    return NextResponse.json({
      success: true,
      message: "Successfully seeded banks and hospitals.",
      data: {
        bankBranch,
        hospitalBranch,
        admins: [
          { email: bankAdmin.email, password: "admin123" },
          { email: hospitalAdmin.email, password: "admin123" }
        ]
      }
    });

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
