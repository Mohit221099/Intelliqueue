import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  
  // Clear existing
  await prisma.token.deleteMany();
  await prisma.service.deleteMany();
  await prisma.user.deleteMany();
  await prisma.branch.deleteMany();

  // 1. Create Branches
  const b1 = await prisma.branch.create({
    data: {
      name: 'Central Bank Main Branch',
      location: 'Downtown Finance District',
      description: 'Main banking hall for corporate and retail clients.',
      workingHours: '{"open": "09:00", "close": "17:00"}',
      queueLimit: 150
    }
  });

  const b2 = await prisma.branch.create({
    data: {
      name: 'City Hospital OPD',
      location: 'North Wing, Health Avenue',
      description: 'Outpatient Department for general consultations.',
      workingHours: '{"open": "08:00", "close": "20:00"}',
      queueLimit: 300
    }
  });

  // 2. Create Services
  const s1 = await prisma.service.create({
    data: { name: 'Cash Deposit/Withdrawal', avgDuration: 10, branchId: b1.id }
  });
  const s2 = await prisma.service.create({
    data: { name: 'Account Opening', avgDuration: 25, branchId: b1.id }
  });
  const s3 = await prisma.service.create({
    data: { name: 'General Physician', avgDuration: 15, branchId: b2.id }
  });

  // 3. Create Admin
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.create({
    data: {
      name: 'Bank Branch Manager',
      email: 'admin@intelliqueue.com',
      password: adminPassword,
      role: 'ADMIN',
      branchId: b1.id
    }
  });
  
  // 4. Create User
  const userPassword = await bcrypt.hash('user123', 10);
  await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'user@intelliqueue.com',
      password: userPassword,
      role: 'USER',
    }
  });

  console.log('Seed successful!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
