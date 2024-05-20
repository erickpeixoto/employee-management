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

  const shapeEmployee = {
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
      data: shapeEmployee,
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
            ...shapeEmployee,
            hireDate: shapeEmployee.hireDate.toISOString(),
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

  it('POST /api/employees/CreateEmployee - Happy Path', async () => {
    const newEmployee = {
      firstName: 'Jane',
      lastName: 'Doe',
      hireDate: new Date('2023-06-01'),
      phone: '555-555-5556',
      address: '456 Elm St',
      departmentId: sampleDepartment.id,
    };

    const result = await request(app.getHttpServer())
      .post('/api/employees/CreateEmployee')
      .send(newEmployee)
      .expect(201);

    expect(result.body).toEqual(
      expect.objectContaining({
        firstName: newEmployee.firstName,
        lastName: newEmployee.lastName,
        hireDate: newEmployee.hireDate.toISOString(),
        phone: newEmployee.phone,
        address: newEmployee.address,
        departmentId: newEmployee.departmentId,
      }),
    );

    await prisma.employee.delete({ where: { id: result.body.id } });
  });

  it('POST /api/employees/CreateEmployee - Validation Error', async () => {
    const invalidEmployee = {
      firstName: '',
      lastName: '',
      hireDate: null,
      phone: '',
      address: '',
      departmentId: null,
    };

    await request(app.getHttpServer())
      .post('/api/employees/CreateEmployee')
      .send(invalidEmployee)
      .expect(400);
  });

  it('POST /api/employees/CreateEmployee - Server Error', async () => {
    jest.spyOn(prisma.employee, 'create').mockImplementationOnce(() => {
      throw new Error('Create error');
    });

    const newEmployee = {
      firstName: 'Jane',
      lastName: 'Doe',
      hireDate: new Date('2023-06-01'),
      phone: '555-555-5556',
      address: '456 Elm St',
      departmentId: sampleDepartment.id,
    };

    const result = await request(app.getHttpServer())
      .post('/api/employees/CreateEmployee')
      .send(newEmployee)
      .expect(400);

    expect(result.body.message).toBe('Create error');
  });
});
