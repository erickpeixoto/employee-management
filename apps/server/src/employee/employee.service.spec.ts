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

  const updatedEmployee = {
    ...sampleEmployee,
    departmentId: 3, 
  };

  const departmentHistoryEntry = {
    id: 1,
    employeeId: sampleEmployee.id,
    oldDepartmentId: sampleEmployee.departmentId,
    newDepartmentId: updatedEmployee.departmentId,
    changeDate: new Date(),
  };

  const mockPrismaService = {
    employee: {
      findMany: jest.fn().mockResolvedValue([sampleEmployee]),
      findUnique: jest.fn().mockResolvedValue(sampleEmployee),
      create: jest.fn().mockResolvedValue(sampleEmployee),
      update: jest.fn().mockResolvedValue(sampleEmployee),
    },
    departmentHistory: {
      create: jest.fn().mockResolvedValue(departmentHistoryEntry),
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
      expect(prisma.employee.findMany).toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      jest.spyOn(prisma.employee, 'findMany').mockRejectedValueOnce(new Error('Database connection error'));
      await expect(service.getAll()).rejects.toThrow('Database connection error');
    });
  });

  describe('getOne', () => {
    it('should return a single employee', async () => {
      const result = await service.getOne(1);
      expect(result).toEqual(sampleEmployee);
      expect(prisma.employee.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { department: true },
      });
    });

    it('should throw an error if employee is not found', async () => {
      jest.spyOn(prisma.employee, 'findUnique').mockResolvedValueOnce(null);
      await expect(service.getOne(1)).rejects.toThrow('Employee not found');
    });

    it('should handle errors', async () => {
      jest.spyOn(prisma.employee, 'findUnique').mockRejectedValueOnce(new Error('Database connection error'));
      await expect(service.getOne(1)).rejects.toThrow('Database connection error');
    });
  });

  describe('create', () => {
    it('should create and return an employee', async () => {
      const result = await service.create(sampleEmployee);
      expect(result).toEqual(sampleEmployee);
      expect(prisma.employee.create).toHaveBeenCalledWith({
        data: {
          firstName: sampleEmployee.firstName,
          lastName: sampleEmployee.lastName,
          hireDate: sampleEmployee.hireDate,
          phone: sampleEmployee.phone,
          address: sampleEmployee.address,
          departmentId: sampleEmployee.departmentId,
        },
      });
    });

    it('should handle errors', async () => {
      jest.spyOn(prisma.employee, 'create').mockRejectedValueOnce(new Error('Create error'));
      await expect(service.create(sampleEmployee)).rejects.toThrow('Create error');
    });
  });

  describe('update', () => {
    it('should update an employee and create a department history record if the department changes', async () => {
      jest.spyOn(prisma.employee, 'findUnique').mockResolvedValueOnce(sampleEmployee);

      const result = await service.update(updatedEmployee);
      expect(result).toEqual(sampleEmployee);
      expect(prisma.employee.update).toHaveBeenCalledWith({
        where: { id: sampleEmployee.id },
        data: {
          firstName: sampleEmployee.firstName,
          lastName: sampleEmployee.lastName,
          hireDate: sampleEmployee.hireDate,
          phone: sampleEmployee.phone,
          address: sampleEmployee.address,
          departmentId: updatedEmployee.departmentId,
        },
      });
      expect(prisma.departmentHistory.create).toHaveBeenCalledWith({
        data: {
          employeeId: sampleEmployee.id,
          oldDepartmentId: sampleEmployee.departmentId,
          newDepartmentId: updatedEmployee.departmentId,
          changeDate: expect.any(Date),
        },
      });
    });

    it('should update an employee without creating a department history record if the department does not change', async () => {
      const noChangeEmployee = { ...sampleEmployee };
      jest.spyOn(prisma.employee, 'findUnique').mockResolvedValueOnce(sampleEmployee);

      const result = await service.update(noChangeEmployee);
      expect(result).toEqual(sampleEmployee);
      expect(prisma.employee.update).toHaveBeenCalledWith({
        where: { id: sampleEmployee.id },
        data: {
          firstName: sampleEmployee.firstName,
          lastName: sampleEmployee.lastName,
          hireDate: sampleEmployee.hireDate,
          phone: sampleEmployee.phone,
          address: sampleEmployee.address,
          departmentId: sampleEmployee.departmentId,
        },
      });
      expect(prisma.departmentHistory.create).not.toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      jest.spyOn(prisma.employee, 'update').mockRejectedValueOnce(new Error('Update error'));
      await expect(service.update(sampleEmployee)).rejects.toThrow('Update error');
    });
  });
});
