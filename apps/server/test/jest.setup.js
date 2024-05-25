const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

beforeEach(async () => {
  await prisma.employee.deleteMany({});
  await prisma.department.deleteMany({});
});

// afterAll(async () => {
//   await prisma.$disconnect();
// });
