"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function processTokenAction(tokenId: string, action: "CALL" | "COMPLETE" | "SKIP", branchId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("Unauthorized access");

    let updateData: any = {};
    if (action === "CALL") {
      updateData = { 
        status: "SERVING", 
        servedAt: new Date(),
      };
    } else if (action === "COMPLETE") {
      updateData = { status: "COMPLETED", completedAt: new Date() };
    } else if (action === "SKIP") {
      updateData = { status: "SKIPPED", completedAt: new Date() };
    }

    const token = await prisma.token.update({
      where: { id: tokenId },
      data: updateData,
    });

    // Detailed activity logging - Using Raw fallback if model isn't generated
    const logData = {
      tokenId,
      branchId,
      adminId: session.user.id,
      adminName: session.user.name,
      action,
      details: action === "CALL" ? "Staff initiated counter service" : 
               action === "COMPLETE" ? "Customer transaction finished" : "Marked as no-show/skipped",
      timestamp: { "$date": new Date().toISOString() }
    };

    try {
      const activityLog = (prisma as any).activityLog;
      if (activityLog) {
        await activityLog.create({ data: { ...logData, timestamp: new Date() } });
      } else {
        // Raw MongoDB insertion as fallback
        await (prisma as any).$runCommandRaw({
          insert: "ActivityLog",
          documents: [logData]
        });
        console.log("📝 Logged via Raw MongoDB fallback");
      }
    } catch (err) {
      console.error("Critical logging failure:", err);
    }

    revalidatePath("/dashboard/queue");
    revalidatePath(`/book/${branchId}`);

    return { success: true, token };
  } catch (error: any) {
    console.error("Action error:", error);
    return { success: false, error: error.message };
  }
}
