import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { HttpStatus } from '@nestjs/common';

describe('EmployeeController', () => {
  let controller: EmployeeController;
  let service: EmployeeService;

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

  const departmentHistoryEntry = {
    id: 1,
    employeeId: sampleEmployee.id,
    oldDepartmentId: sampleEmployee.departmentId,
    newDepartmentId: 3,
    changeDate: new Date(),
    oldDepartment: { id: 2, name: 'Engineering' },
    newDepartment: { id: 3, name: 'HR' },
  };

  const mockEmployeeService = {
    getAll: jest.fn().mockResolvedValue([sampleEmployee]),
    create: jest.fn().mockResolvedValue(sampleEmployee),
    update: jest.fn().mockResolvedValue(sampleEmployee),
    getOne: jest.fn().mockResolvedValue(sampleEmployee),
    delete: jest.fn().mockResolvedValue({ message: 'Employee deleted successfully' }),
    getDepartmentHistory: jest.fn().mockResolvedValue([departmentHistoryEntry]),
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

  describe('getAllEmployees', () => {
    it('should return an array of employees', async () => {
      const result = await controller.handler().then(handler => handler.getAll({ headers: {}, query: { page: 1, limit: 10 } }));
      expect(result.status).toBe(HttpStatus.OK);
      expect(result.body).toEqual([sampleEmployee]);
    });

    it('should call the service', async () => {
      await controller.handler().then(handler => handler.getAll({ headers: {}, query: { page: 1, limit: 10 } }));
      expect(service.getAll).toHaveBeenCalled();
    });

    it('should handle errors thrown by EmployeeService.getAll', async () => {
      jest.spyOn(service, 'getAll').mockRejectedValueOnce(new Error('Database connection error'));
      const result = await controller.handler().then(handler => handler.getAll({ headers: {}, query: { page: 1, limit: 10 } })).catch(err => err);
      expect(result.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(result.body.message).toBe('Database connection error');
    });
  });

  describe('createEmployee', () => {
    it('should create and return an employee', async () => {
      const result = await controller.handler().then(handler => handler.create({
        headers: {},
        body: {
          ...sampleEmployee,
          isActive: false,
          avatar: ''
        },
      }));
      expect(result.status).toBe(HttpStatus.CREATED);
      expect(result.body).toEqual(sampleEmployee);
    });

    it('should handle validation errors', async () => {
      const invalidBody = {
        firstName: '',
        lastName: '',
        hireDate: null,
        phone: '',
        address: '',
        departmentId: null,
        isActive: false,
        avatar: ''
      };
      const result = await controller.handler().then(handler => handler.create({
        headers: {},
        body: invalidBody,
      })).catch(err => err);
      expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      expect(result.body.errors.length).toBeGreaterThan(0);
    });

    it('should handle server errors', async () => {
      jest.spyOn(service, 'create').mockRejectedValueOnce(new Error('Create error'));
      const result = await controller.handler().then(handler => handler.create({
        headers: {},
        body: {
          ...sampleEmployee,
          isActive: false,
          avatar: ''
        },
      })).catch(err => err);
      expect(result.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(result.body.message).toBe('Create error');
    });
  });

  describe('updateEmployee', () => {
    it('should update and return an employee', async () => {
      const result = await controller.handler().then(handler => handler.update({
        headers: {},
        body: {
          ...sampleEmployee,
          isActive: true,
          avatar: ''
        },
      }));
      expect(result.status).toBe(HttpStatus.OK);
      expect(result.body).toEqual(sampleEmployee);
    });

    it('should handle validation errors', async () => {
      const invalidBody = {
        id: sampleEmployee.id,
        isActive: true,
        avatar: '',
        firstName: '',
        lastName: '',
        hireDate: null,
        phone: '',
        address: '',
        departmentId: null,
      };
      const result = await controller.handler().then(handler => handler.update({
        headers: {},
        body: invalidBody,
      })).catch(err => err);
      expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      expect(result.body.errors.length).toBeGreaterThan(0);
    });

    it('should handle server errors', async () => {
      jest.spyOn(service, 'update').mockRejectedValueOnce(new Error('Update error'));
      const result = await controller.handler().then(handler => handler.update({
        headers: {},
        body: { ...sampleEmployee, isActive: true, avatar: '' },
      })).catch(err => err);
      expect(result.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(result.body.message).toBe('Update error');
    });
  });

  describe('getOneEmployee', () => {
    it('should return a single employee', async () => {
      const result = await controller.handler().then(handler => handler.getOne({ query: { id: 1 }, headers: {} }));
      expect(result.status).toBe(HttpStatus.OK);
      expect(result.body).toEqual(sampleEmployee);
    });

    it('should handle validation errors for query params', async () => {
      const result = await controller.handler().then(handler => handler.getOne({ query: { id: null }, headers: {} })).catch(err => err);
      expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      expect(result.body.errors.length).toBeGreaterThan(0);
    });

    it('should handle server errors', async () => {
      jest.spyOn(service, 'getOne').mockRejectedValueOnce(new Error('Employee not found'));
      const result = await controller.handler().then(handler => handler.getOne({ query: { id: 1 }, headers: {} })).catch(err => err);
      expect(result.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(result.body.message).toBe('Employee not found');
    });
  });

  describe('deleteEmployee', () => {
    it('should delete an employee', async () => {
      const result = await controller.handler().then(handler => handler.delete({ body: { id: 1 }, headers: {} }));
      expect(result.status).toBe(HttpStatus.NO_CONTENT);
    });

    it('should handle validation errors for query params', async () => {
      const result = await controller.handler().then(handler => handler.delete({ body: { id: null }, headers: {} })).catch(err => err);
      expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      expect(result.body.errors.length).toBeGreaterThan(0);
    });

    it('should handle server errors', async () => {
      jest.spyOn(service, 'delete').mockRejectedValueOnce(new Error('Employee not found'));
      const result = await controller.handler().then(handler => handler.delete({ body: { id: 1 }, headers: {} })).catch(err => err);
      expect(result.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(result.body.message).toBe('Employee not found');
    });
  });

  describe('getDepartmentHistory', () => {
    it('should return department history for an employee', async () => {
      const result = await controller.handler().then(handler => handler.getDepartmentHistory({
        query: { employeeId: sampleEmployee.id, page: 1, limit: 10 },
        headers: {},
      }));
      expect(result.status).toBe(HttpStatus.OK);
      expect(result.body).toEqual([departmentHistoryEntry]);
    });

    it('should handle validation errors', async () => {
      const result = await controller.handler().then(handler => handler.getDepartmentHistory({
        query: { employeeId: null, page: 1, limit: 10 },
        headers: {},
      })).catch(err => err);
      expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      expect(result.body.errors.length).toBeGreaterThan(0);
    });

    it('should handle server errors', async () => {
      jest.spyOn(service, 'getDepartmentHistory').mockRejectedValueOnce(new Error('Server error'));
      const result = await controller.handler().then(handler => handler.getDepartmentHistory({
        query: { employeeId: sampleEmployee.id, page: 1, limit: 10 },
        headers: {},
      })).catch(err => err);
      expect(result.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(result.body.message).toBe('Server error');
    });
  });
});
