import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeService } from './employee.service';
import { PrismaService } from '../prisma.service';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let prisma: PrismaService;

  const sampleEmployee = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    hireDate: new Date('2023-05-18'),
    phone: '555-555-5555',
    address: '123 Main St',
    departmentId: 2,
    department: {
      id: 2,
      name: 'Engineering',
    },
  };

  const mockPrismaService = {
    employee: {
      findMany: jest.fn().mockResolvedValue([sampleEmployee]),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeeService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<EmployeeService>(EmployeeService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array of employees', async () => {
      const result = await service.getAll();
      expect(result).toEqual([sampleEmployee]);
      expect(prisma.employee.findMany).toHaveBeenCalledWith({
        include: {
          department: true,
        },
      });
    });

    it('should throw an error if the database fails', async () => {
      jest.spyOn(prisma.employee, 'findMany').mockRejectedValue(new Error('Database error'));

      await expect(service.getAll()).rejects.toThrow('Database error');
    });
  });
});
