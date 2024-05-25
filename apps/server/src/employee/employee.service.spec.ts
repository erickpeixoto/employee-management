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
    isActive: true,
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
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
      delete: jest.fn().mockResolvedValue(sampleEmployee),
      count: jest.fn().mockResolvedValue(1),
    },
    departmentHistory: {
      create: jest.fn().mockResolvedValue(departmentHistoryEntry),
      findMany: jest.fn().mockResolvedValue([departmentHistoryEntry]),
      deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
      count: jest.fn().mockResolvedValue(1),
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
      const result = await service.getAll(1, 10);
      expect(result).toEqual({ employees: [sampleEmployee], totalEmployees: 1 });
      expect(prisma.employee.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        include: { department: true },
      });
      expect(prisma.employee.count).toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      jest.spyOn(prisma.employee, 'findMany').mockRejectedValueOnce(new Error('Database connection error'));
      await expect(service.getAll(1, 10)).rejects.toThrow('Database connection error');
    });
  });

  describe('getOne', () => {
    it('should return a single employee', async () => {
      const result = await service.getOne(1);
      expect(result).toEqual(sampleEmployee);
      expect(prisma.employee.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { department: true, departmentHistories: { include: { oldDepartment: true, newDepartment: true } } },
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
          avatar: sampleEmployee.avatar,
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
          isActive: sampleEmployee.isActive,
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
          isActive: sampleEmployee.isActive,
        },
      });
      expect(prisma.departmentHistory.create).not.toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      jest.spyOn(prisma.employee, 'update').mockRejectedValueOnce(new Error('Update error'));
      await expect(service.update(sampleEmployee)).rejects.toThrow('Update error');
    });

    it('should throw an error if employee is not found', async () => {
      jest.spyOn(prisma.employee, 'findUnique').mockResolvedValueOnce(null);
      await expect(service.update(sampleEmployee)).rejects.toThrow('Employee not found');
    });
  });

  describe('delete', () => {
    it('should delete an employee', async () => {
      const result = await service.delete(1);
      expect(result).toEqual({ message: 'Employee deleted successfully' });
      expect(prisma.departmentHistory.deleteMany).toHaveBeenCalledWith({
        where: { employeeId: 1 },
      });
      expect(prisma.employee.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should handle errors', async () => {
      jest.spyOn(prisma.employee, 'delete').mockRejectedValueOnce(new Error('Delete error'));
      await expect(service.delete(1)).rejects.toThrow('Delete error');
    });

    it('should throw an error if employee is not found', async () => {
      jest.spyOn(prisma.employee, 'delete').mockResolvedValueOnce(null);
      await expect(service.delete(1)).rejects.toThrow('Employee not found');
    });
  });

  describe('getDepartmentHistory', () => {
    it('should return department history for an employee', async () => {
      const result = await service.getDepartmentHistory(1, 1, 10);
      expect(result).toEqual({ histories: [departmentHistoryEntry], totalHistories: 1 });
      expect(prisma.departmentHistory.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        where: { employeeId: 1 },
        include: { oldDepartment: true, newDepartment: true },
      });
      expect(prisma.departmentHistory.count).toHaveBeenCalledWith({
        where: { employeeId: 1 },
      });
    });

    it('should handle errors', async () => {
      jest.spyOn(prisma.departmentHistory, 'findMany').mockRejectedValueOnce(new Error('Database connection error'));
      await expect(service.getDepartmentHistory(1, 1, 10)).rejects.toThrow('Database connection error');
    });
  });
});
