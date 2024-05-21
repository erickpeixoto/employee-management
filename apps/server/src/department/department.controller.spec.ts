import { Test, TestingModule } from '@nestjs/testing';
import { DepartmentController } from './department.controller';
import { DepartmentService } from './department.service';
import { contract, handleError } from 'ts-contract';

describe('DepartmentController', () => {
  let controller: DepartmentController;
  let service: DepartmentService;

  const departments = [
    { id: 1, name: 'Engineering' },
    { id: 2, name: 'HR' },
  ];

  const mockDepartmentService = {
    getAll: jest.fn().mockResolvedValue(departments),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DepartmentController],
      providers: [
        {
          provide: DepartmentService,
          useValue: mockDepartmentService,
        },
      ],
    }).compile();

    controller = module.get<DepartmentController>(DepartmentController);
    service = module.get<DepartmentService>(DepartmentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array of departments - Happy Path', async () => {
      jest.spyOn(service, 'getAll').mockResolvedValue(departments);

      const result = await controller
        .handler()
        .then((handler) => handler.getAll({ headers: {} }));
      expect(result.status).toBe(200);
      expect(result.body).toEqual(departments);
    });

    it('should handle errors thrown by DepartmentService.getAll - Unhappy Path', async () => {
      const errorMessage = 'Database connection error';
      jest.spyOn(service, 'getAll').mockRejectedValue(new Error(errorMessage));

      const result = await controller
        .handler()
        .then((handler) => handler.getAll({ headers: {} }))
        .catch((err) => err);
        expect(result.status).toBe(500);
    });
  });
});
