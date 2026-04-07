import prisma from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import BookingClient from './BookingClient';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const revalidate = 0;

export default async function BranchBookingPage({ params }: { params: Promise<{ branchId: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  const { branchId } = await params;
  const branch = await prisma.branch.findUnique({
    where: { id: branchId },
    include: { services: true },
  });

  if (!branch) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <BookingClient branch={branch} user={session.user} />
      </div>
    </div>
  );
}
