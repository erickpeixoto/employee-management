import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';

describe('EmployeeController', () => {
  let controller: EmployeeController;
  let service: EmployeeService;

  const shapeEmployee = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    hireDate: new Date('2023-05-18'),
    phone: '555-555-5555',
    address: '123 Main St',
    departmentId: 2,
  };

  const mockEmployeeService = {
    getAll: jest.fn().mockResolvedValue([shapeEmployee]),
    create: jest.fn().mockResolvedValue(shapeEmployee),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeController],
      providers: [
        {
          provide: EmployeeService,
          useValue: mockEmployeeService,
        },
      ],
    }).compile();

    controller = module.get<EmployeeController>(EmployeeController);
    service = module.get<EmployeeService>(EmployeeService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Method getAllEmployees', () => {
    it('should return an array of employees', async () => {
      const result = await controller.handler().then(handler => handler.getAll({ headers: {} }));
      expect(result.status).toBe(200);
      expect(result.body).toEqual([shapeEmployee]);
    });

    it('should call the service', async () => {
      await controller.handler().then(handler => handler.getAll({ headers: {} }));
      expect(service.getAll).toHaveBeenCalled();
    });

    it('should handle errors thrown by EmployeeService.getAll', async () => {
      jest.spyOn(service, 'getAll').mockRejectedValueOnce(new Error('Database connection error'));

      const result = await controller.handler().then(handler => handler.getAll({ headers: {} })).catch(err => err);
      expect(result.status).toBe(500);
      expect(result.body.message).toBe('Database connection error');
    });
  });

  describe('Method createEmployee', () => {
    it('should create and return an employee', async () => {
      const result = await controller.handler().then(handler => handler.create({
        headers: {},
        body: shapeEmployee,
      }));
      expect(result.status).toBe(201);
      expect(result.body).toEqual(shapeEmployee);
    });

    it('should call the service', async () => {
      await controller.handler().then(handler => handler.create({
        headers: {},
        body: shapeEmployee,
      }));
      expect(service.create).toHaveBeenCalled();
    });

    it('should handle errors thrown by EmployeeService.create', async () => {
      jest.spyOn(service, 'create').mockRejectedValueOnce(new Error('Create error'));

      const result = await controller.handler().then(handler => handler.create({
        headers: {},
        body: shapeEmployee,
      })).catch(err => err);
      expect(result.status).toBe(400);
      expect(result.body.message).toBe('Create error');
    });

    it('should validate input and return a 400 status if invalid', async () => {
      const invalidBody = {
        firstName: '',
        lastName: '',
        hireDate: null,
        phone: '',
        address: '',
        departmentId: null,
      };
      const result = await controller.handler().then(handler => handler.create({
        headers: {},
        body: invalidBody,
      })).catch(err => err);
      expect(result.status).toBe(400);
      expect(result.body.errors.length).toBeGreaterThan(0);
      expect(result.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            code: 'invalid_type',
            path: ['hireDate'],
            message: 'Required',
          }),
          expect.objectContaining({
            code: 'invalid_type',
            path: ['departmentId'],
            message: 'Expected number, received null',
          }),
        ])
      );
    });
  });
});