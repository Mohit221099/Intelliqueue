import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const password = await bcrypt.hash("admin123", 10);

    // 1. JIS College Canteen
    const canteenBranch = await prisma.branch.create({
      data: {
        name: "JIS College Canteen",
        location: "Kalyani, West Bengal",
        description: "Premium student dining floor. Skip the peak hours rush.",
        workingHours: "09:00 - 19:00",
        queueLimit: 300,
        services: {
          create: [
            { name: "Breakfast Counter", avgDuration: 5 },
            { name: "Lunch Special", avgDuration: 8 },
            { name: "Thali Counter", avgDuration: 10 },
            { name: "Snacks & Tea", avgDuration: 3 }
          ]
        }
      }
    });

    // 2. Dakshineswar Kali Temple
    const templeBranch = await prisma.branch.create({
      data: {
        name: "Dakshineswar Kali Temple",
        location: "Kolkata, WB",
        description: "Digital Darshan slots — maintaining sacred flow.",
        workingHours: "06:00 - 21:00",
        queueLimit: 1000,
        services: {
          create: [
            { name: "General Darshan", avgDuration: 15 },
            { name: "VIP Entry", avgDuration: 5 },
            { name: "Prasad Counter", avgDuration: 3 }
          ]
        }
      }
    });

    // 3. Create Admins
    const canteenAdmin = await prisma.user.create({
      data: {
        name: "Canteen Manager",
        email: "canteen@jis.edu",
        password,
        role: "ADMIN",
        branchId: canteenBranch.id
      }
    });

    const templeAdmin = await prisma.user.create({
      data: {
        name: "Temple Admin",
        email: "temple@dakshineswar.org",
        password,
        role: "ADMIN",
        branchId: templeBranch.id
      }
    });

    return NextResponse.json({
      success: true,
      message: "Day 2 Demo Data Ready (JIS Canteen & Temple)",
      data: {
        admins: [
          { email: canteenAdmin.email, password: "admin123", role: "Canteen Admin" },
          { email: templeAdmin.email, password: "admin123", role: "Temple Admin" }
        ]
      }
    });

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
