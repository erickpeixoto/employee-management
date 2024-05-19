import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';

describe('EmployeeController', () => {
  let controller: EmployeeController;
  let service: EmployeeService;

  const sampleEmployee = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    hireDate: new Date('2023-05-18').toISOString(),
    phone: '555-555-5555',
    address: '123 Main St',
    departmentId: 2,
    department: {
      id: 2,
      name: 'Engineering',
    },
  };

  const mockEmployeeService = {
    getAll: jest.fn().mockResolvedValue([sampleEmployee]),
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
      expect(result.body).toEqual([sampleEmployee]);
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
});
