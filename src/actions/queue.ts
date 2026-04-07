"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { sendBookingEmail } from "@/lib/mailer";

export async function createToken(branchId: string, serviceId: string, userId?: string) {
  try {
    const branch = await prisma.branch.findUnique({
      where: { id: branchId },
      include: {
        _count: {
          select: { tokens: { where: { status: "WAITING" } } }
        }
      }
    });

    if (!branch) throw new Error("Branch not found");

    if (branch._count.tokens >= branch.queueLimit) {
      throw new Error("Branch queue is full. Please try again later.");
    }

    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) throw new Error("Service not found");

    // Check waiting count specific to the service vs total
    const waitingTokens = await prisma.token.count({
      where: { branchId, status: "WAITING" }
    });

    // Simple ETA prediction logic (WAITING count * avgDuration)
    const estimatedMinutes = waitingTokens * service.avgDuration;
    const estimatedServeTime = new Date(Date.now() + estimatedMinutes * 60000);

    // Generate dynamic token sequence based on current queue load
    const branchPrefix = branch.name.substring(0, 1).toUpperCase();
    const servicePrefix = service.name.substring(0, 1).toUpperCase();
    
    const lastActiveToken = await prisma.token.findFirst({
      where: { 
        branchId, 
        serviceId,
        status: { in: ["WAITING", "SERVING"] }
      },
      orderBy: { issuedAt: "desc" }
    });

    let nextNum = 1;
    if (lastActiveToken) {
      const parts = lastActiveToken.tokenNumber.split("-");
      const lastNum = parseInt(parts[parts.length - 1]);
      nextNum = isNaN(lastNum) ? 1 : lastNum + 1;
    }
    
    // Format: e.g. H-C-001
    const tokenNumber = `${branchPrefix}${servicePrefix}-${String(nextNum).padStart(3, '0')}`;

    if (!userId) {
      throw new Error("You must be logged in to book a spot.");
    }
    const actualUserId = userId;

    const token = await prisma.token.create({
      data: {
        tokenNumber,
        branchId,
        serviceId,
        userId: actualUserId,
        status: "WAITING",
        estimatedServeTime,
        priority: false,
      }
    });

    // Notify user via Email
    try {
      const user = await prisma.user.findUnique({ where: { id: actualUserId } });
      console.log("🔍 Checking user for email notification:", user?.email);
      if (user && user.email) {
        await sendBookingEmail(
          user.email,
          user.name || "User",
          token.id,
          tokenNumber,
          branch.name,
          service.name,
          estimatedServeTime
        );
        console.log("✅ Email sent successfully to:", user.email);
      } else {
        console.warn("⚠️ No valid email found for user:", user?.id);
      }
    } catch (mailErr) {
      console.error("❌ Failed to send booking email:", mailErr);
      // We don't fail the booking if email fails
    }

    revalidatePath("/book");
    revalidatePath(`/book/${branchId}`);

    return { success: true, token };
  } catch (err: any) {
    console.error("Booking error:", err.message);
    return { success: false, error: err.message };
  }
}
