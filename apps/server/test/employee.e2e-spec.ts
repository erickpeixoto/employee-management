import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma.service';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

describe('EmployeeController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  const sampleDepartments = [
    { id: 1, name: 'Engineering' },
    { id: 2, name: 'HR' },
  ];

  const sampleEmployees = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      departmentId: 1,
      avatar: 'avatar1.png',
      hireDate: new Date(),
      phone: '123-456-7890',
      address: '123 Main St',
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      departmentId: 2,
      avatar: 'avatar2.png',
      hireDate: new Date(),
      phone: '098-765-4321',
      address: '456 Elm St',
    },
  ];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get<PrismaService>(PrismaService);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return an array of employees - Happy Path', async () => {
    await prisma.department.createMany({ data: sampleDepartments });
    await prisma.employee.createMany({ data: sampleEmployees });

    const response = await request(app.getHttpServer())
      .get('/api/employees/GetAllEmployees?page=1&limit=10')
      .expect(200);

    expect(response.body.employees.length).toBe(sampleEmployees.length);
    expect(response.body.totalEmployees).toBe(sampleEmployees.length);
  });
});
