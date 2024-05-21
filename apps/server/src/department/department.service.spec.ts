import { Test, TestingModule } from '@nestjs/testing';
import { DepartmentService } from './department.service';
import { PrismaService } from '../prisma.service';

describe('DepartmentService', () => {
  let service: DepartmentService;
  let prisma: PrismaService;

  const departments = [
    { id: 1, name: 'Engineering' },
    { id: 2, name: 'HR' },
  ];

  const mockPrismaService = {
    department: {
      findMany: jest.fn().mockResolvedValue(departments),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DepartmentService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<DepartmentService>(DepartmentService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array of departments - Happy Path', async () => {
      const result = await service.getAll();
      expect(result).toEqual(departments);
      expect(prisma.department.findMany).toHaveBeenCalled();
    });

    it('should handle errors thrown by PrismaService - Unhappy Path', async () => {
      const errorMessage = 'Database connection error';
      jest.spyOn(prisma.department, 'findMany').mockRejectedValue(new Error(errorMessage));

      await expect(service.getAll()).rejects.toThrowError(errorMessage);
    });
  });
});
