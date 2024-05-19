import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma.service';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

describe('EmployeeController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  const sampleDepartment = {
    id: 2,
    name: 'Engineering',
  };

  const sampleEmployee = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    hireDate: new Date('2023-05-18'),
    phone: '555-555-5555',
    address: '123 Main St',
    departmentId: sampleDepartment.id,
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get<PrismaService>(PrismaService);

    await prisma.employee.deleteMany();
    await prisma.department.deleteMany();

    await prisma.department.create({
      data: sampleDepartment,
    });

    await prisma.employee.create({
      data: {
        ...sampleEmployee,
        hireDate: new Date(sampleEmployee.hireDate),
      },
    });

    await app.init();
  });

  afterAll(async () => {
    await prisma.employee.deleteMany();
    await prisma.department.deleteMany();
    await app.close();
  });

  it('GET /api/employees/GetAllEmployees - Happy Path', () => {
    return request(app.getHttpServer())
      .get('/api/employees/GetAllEmployees')
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual([
          {
            ...sampleEmployee,
            hireDate: sampleEmployee.hireDate.toISOString(),
            department: sampleDepartment,
          },
        ]);
      });
  });

  it('GET /api/employees/GetAllEmployees - Unhappy Path', async () => {
    jest.spyOn(prisma.employee, 'findMany').mockImplementationOnce(() => {
      throw new Error('Database connection error');
    });

    const result = await request(app.getHttpServer())
      .get('/api/employees/GetAllEmployees')
      .expect(500);
      
    expect(result.body.message).toBe('Database connection error');
  });
});
