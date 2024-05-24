import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Remover todas as relações de empregados com departamentos
  await prisma.departmentHistory.deleteMany();
  await prisma.employee.updateMany({
    data: { departmentId: undefined },
  });

  // Excluir todos os departamentos
  await prisma.department.deleteMany();

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
