import prisma from "@/lib/prisma";
import DashboardClient from "./DashboardClient";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  
  // If the admin belongs to a branch, only fetch their branch. Else fetch total
  const branchFilter = session?.user?.branchId ? { branchId: session.user.branchId } : {};

  const totalServed = await prisma.token.count({
    where: { ...branchFilter, status: "COMPLETED" },
  });

  const waitingCount = await prisma.token.count({
    where: { ...branchFilter, status: "WAITING" },
  });

  // Calculate average wait time logic - we'll mock if no logs exist, or calculate manually:
  const completedTokens = await prisma.token.findMany({
    where: { ...branchFilter, status: "COMPLETED" },
    select: { issuedAt: true, servedAt: true }
  });

  let averageWaitTime = 12; // default mock AI optimized time
  if (completedTokens.length > 0) {
    let totalMins = 0;
    let actualValid = 0;
    completedTokens.forEach(t => {
      if (t.servedAt && t.issuedAt) {
        totalMins += (t.servedAt.getTime() - t.issuedAt.getTime()) / 60000;
        actualValid++;
      }
    });
    if (actualValid > 0) averageWaitTime = Math.round(totalMins / actualValid);
  }

  // Mocking peak hours for visual demo
  const peakHours = [
    { hour: "9 AM", count: 45 },
    { hour: "10 AM", count: 85 },
    { hour: "11 AM", count: 110 },
    { hour: "12 PM", count: 90 },
    { hour: "1 PM", count: 65 },
    { hour: "2 PM", count: 50 },
    { hour: "3 PM", count: 70 },
    { hour: "4 PM", count: 40 },
  ];

  // Mocking history load trends for visual demo
  const historyData = [
    { day: "Mon", count: 120 },
    { day: "Tue", count: 150 },
    { day: "Wed", count: 180 },
    { day: "Thu", count: 160 },
    { day: "Fri", count: 210 },
    { day: "Sat", count: 90 },
    { day: "Sun", count: 60 },
  ];

  let recentLogs: any[] = [];
  try {
    const activityLog = (prisma as any).activityLog;
    if (activityLog) {
      recentLogs = await activityLog.findMany({
        where: branchFilter,
        orderBy: { timestamp: "desc" },
        take: 8
      });
    }
  } catch (err) {
    console.warn("Audit logs temporarily offline:", err);
  }

  const analytics = {
    totalServed,
    averageWaitTime,
    waitingCount,
    peakHours,
    historyData,
    recentLogs
  };

  return <DashboardClient analytics={analytics} />;
}
