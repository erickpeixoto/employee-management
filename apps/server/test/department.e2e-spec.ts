import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma.service';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

describe('DepartmentController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  const sampleDepartments = [
    { id: 1, name: 'Engineering' },
    { id: 2, name: 'HR' },
  ];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get<PrismaService>(PrismaService);

    await prisma.department.deleteMany();

    await prisma.department.createMany({
      data: sampleDepartments,
    });

    await app.init();
  });

  afterAll(async () => {
    await prisma.department.deleteMany();
    await app.close();
  });

  describe('GET /api/departments/GetAllDepartments', () => {
    it('should return an array of departments - Happy Path', () => {
      return request(app.getHttpServer())
        .get('/api/departments/GetAllDepartments')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(sampleDepartments);
        });
    });

    it('should handle errors thrown by DepartmentService.getAll - Unhappy Path', async () => {
      jest.spyOn(prisma.department, 'findMany').mockImplementationOnce(() => {
        throw new Error('Database connection error');
      });

      await request(app.getHttpServer())
        .get('/api/departments/GetAllDepartments')
        .expect(500);
    });
  });
});
