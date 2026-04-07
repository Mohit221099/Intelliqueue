import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import QueueClient from "./QueueClient";
import { redirect } from "next/navigation";

export const revalidate = 0;

export default async function AdminQueuePage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.branchId) redirect("/login");

  const branchId = session.user.branchId;

  const waitingTokens = await prisma.token.findMany({
    where: { branchId, status: "WAITING" },
    orderBy: [
      { priority: 'desc' },
      { issuedAt: 'asc' }
    ],
    include: { service: true, user: true }
  });

  const servingTokens = await prisma.token.findMany({
    where: { branchId, status: "SERVING" },
    include: { service: true, user: true }
  });

  let logs: any[] = [];
  try {
    const activityLog = (prisma as any).activityLog;
    if (activityLog) {
      logs = await activityLog.findMany({
        where: { branchId },
        orderBy: { timestamp: 'desc' },
        take: 50,
      });
    }
  } catch (err) {
    console.warn("Queue logs not yet available in Prisma Client:", err);
  }

  return <QueueClient branchId={branchId} waitingTokens={waitingTokens} servingTokens={servingTokens} logs={logs} />;
}
