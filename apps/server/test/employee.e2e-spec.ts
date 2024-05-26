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
  const createDepartments = async () => {
    await prisma.department.deleteMany();
    await prisma.department.createMany({ data: sampleDepartments });
  };

  const createEmployees = async () => {
    await prisma.employee.deleteMany();
    await prisma.employee.createMany({ data: sampleEmployees });
  };
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get<PrismaService>(PrismaService);

    await prisma.department.deleteMany();
    await prisma.department.createMany({ data: sampleDepartments });
    await app.init();
  });

  beforeEach(async () => {
    await prisma.employee.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /api/employees/GetAllEmployees', () => {
    it('should return an array of employees - Happy Path', async () => {
      await createDepartments();
      await createEmployees();

      const response = await request(app.getHttpServer())
        .get('/api/employees/GetAllEmployees?page=1&limit=10')
        .expect(200);

      expect(response.body.employees.length).toBe(sampleEmployees.length);
      expect(response.body.totalEmployees).toBe(sampleEmployees.length);
    });

    it('should return 400 if validation fails - Unhappy Path', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/employees/GetAllEmployees?page=invalid&limit=10')
        .expect(400);

      const responseFormatted = response.body.queryResult.issues.map((issue) => {
        return {
          code: issue.code,
          expected: issue.expected,
          received: issue.received,
          path: issue.path,
          message: issue.message,
        };
      });
      expect(responseFormatted).toEqual([
        {
          code: 'invalid_type',
          expected: 'number',
          received: 'nan',
          path: ['page'],
          message: 'Expected number, received nan',
        },
      ]);
    });

  });

  describe('POST /api/employees', () => {
    it('should create a new employee - Happy Path', async () => {
      await createDepartments();
      const newEmployee = {
        isActive: true,
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
        firstName: 'Alice',
        lastName: 'Johnson',
        departmentId: 1,
        hireDate: "2023-05-18T00:00:00.000Z",
        phone: '555-555-5555',
        address: '789 Oak St',
      };

      const response = await request(app.getHttpServer())
        .post('/api/employees/CreateEmployee')
        .send(newEmployee)
        .expect(201);

      expect(response.body).toMatchObject(newEmployee);
    });

    it('should return 400 if required fields are missing', async () => {
      const newEmployee = {
        isActive: true,
      };

    await request(app.getHttpServer())
        .post('/api/employees/CreateEmployee')
        .send(newEmployee)
        .expect(400);
    });

     it('should return 400 if field types are incorrect', async () => {
       const newEmployee = {
        isActive: true,
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
        firstName: 'Alice',
        lastName: 'Johnson',
        departmentId: 'invalid',
        hireDate: "2023-05-18T00:00:00.000Z",
        phone: '555-555-5555',
        address: '789 Oak St',
      };
      const response = await request(app.getHttpServer())
        .post('/api/employees/CreateEmployee')
        .send(newEmployee)
        .expect(400);
      expect(response.body.message).toBe(undefined);
    });
  });

  describe('PUT /api/employees', () => {
    it('should update an employee - Happy Path', async () => {
      await createDepartments();
      await createEmployees();
      const updatedEmployee = {
        id: 1,
        isActive: true,
        avatar: 'image.png',
        firstName: 'Alice',
        lastName: 'Johnson',
        departmentId: 1,
        hireDate: "2023-05-18T00:00:00.000Z",
        phone: '555-555-5555',
        address: '789 Oak St',
      };

      const response = await request(app.getHttpServer())
        .put('/api/employees/UpdateEmployee')
        .send(updatedEmployee)
        .expect(200);

      expect(response.body).toMatchObject(updatedEmployee);
    });

    it('should return 400 if required fields are missing', async () => {
      const updatedEmployee = {
        id: 1,
        isActive: true,
      };

      await request(app.getHttpServer())
        .put('/api/employees/UpdateEmployee')
        .send(updatedEmployee)
        .expect(400);
    });

    it('should return 400 if field types are incorrect', async () => {
      const updatedEmployee = {
        id: 1,
        isActive: true,
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
        firstName: 'Alice',
        lastName: 'Johnson',
        departmentId: 'invalid',
        hireDate: "2023-05-18T00:00:00.000Z",
        phone: '555-555-5555',
        address: '789 Oak St',
      };

      await request(app.getHttpServer())
        .put('/api/employees/UpdateEmployee')
        .send(updatedEmployee)
        .expect(400);
    });
  });

  describe('DELETE /api/employees', () => {
    it('should delete an employee - Happy Path', async () => {
      await createDepartments();
      await createEmployees();

      const response = await request(app.getHttpServer())
        .delete('/api/employees/DeleteEmployee')
        .send({ id: 1 })
        .expect(200);
      expect(response.body).toMatchObject({ message: 'Employee deleted' });
    });

    it('should return 400 if required fields are missing', async () => {
      await request(app.getHttpServer())
        .delete('/api/employees/DeleteEmployee')
        .send({})
        .expect(400);
    });

    it('should return 400 if field types are incorrect', async () => {
      await request(app.getHttpServer())
        .delete('/api/employees/DeleteEmployee')
        .send({ id: 'invalid' })
        .expect(400);
    });
  });

});

