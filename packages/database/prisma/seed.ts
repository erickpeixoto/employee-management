import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.departmentHistory.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.department.deleteMany();

  // Seed new data
  const departments = [
    { name: 'Engineering' },
    { name: 'Human Resources' },
    { name: 'Marketing' },
  ];

  for (const department of departments) {
    await prisma.department.create({
      data: department,
    });
  }

  console.log('Departments created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
