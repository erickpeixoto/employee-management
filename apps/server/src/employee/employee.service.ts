import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Employee } from 'ts-contract';

@Injectable()
export class EmployeeService {
  constructor(private prisma: PrismaService) {}

  async getAll(page: number, limit: number) {
    const offset = (page - 1) * limit;
    const employees = await this.prisma.employee.findMany({
      skip: offset,
      take: limit,
      include: {
        department: true,
      },
    });
    const totalEmployees = await this.prisma.employee.count();
    return {
      employees,
      totalEmployees,
    };
  }

  async create(employee: Employee) {
    const {
      avatar,
      firstName,
      lastName,
      hireDate,
      phone,
      address,
      departmentId,
    } = employee;
    const response = await this.prisma.employee.create({
      data: {
        avatar,
        firstName,
        lastName,
        hireDate,
        phone,
        address,
        departmentId,
      },
    });
    return response;
  }

  async update(employee: Omit<Employee, 'id'> & { id: number }) {
    const existingEmployee = await this.prisma.employee.findUnique({
      where: { id: employee.id },
    });

    if (!existingEmployee) {
      throw new Error('Employee not found');
    }

    if (existingEmployee.departmentId !== employee.departmentId) {
      await this.prisma.departmentHistory.create({
        data: {
          employeeId: employee.id,
          oldDepartmentId: existingEmployee.departmentId,
          newDepartmentId: employee.departmentId,
          changeDate: new Date(),
        },
      });
    }

    const response = await this.prisma.employee.update({
      where: { id: employee.id },
      data: employee as any,
    });

    return response;
  }

  async getOne(id: number) {
    const response = await this.prisma.employee.findUnique({
      where: { id },
      include: {
        department: true,
        departmentHistories: {
          include: {
            oldDepartment: true,
            newDepartment: true,
          },
        },
      },
    });

    if (!response) {
      throw new Error('Employee not found');
    }

    return response;
  }

  async delete(id: number) {
    await this.prisma.departmentHistory.deleteMany({
      where: { employeeId: id },
    });

    const response = await this.prisma.employee.delete({
      where: { id },
    });

    if (!response) {
      throw new Error('Employee not found');
    }
    return {
      message: 'Employee deleted',
    };
  }

  async getDepartmentHistory(employeeId: number, page: number, limit: number) {
    const offset = (page - 1) * limit;
    const response = await this.prisma.departmentHistory.findMany({
      skip: offset,
      take: limit,
      where: { employeeId: Number(employeeId) },
      include: {
        oldDepartment: true,
        newDepartment: true,
      },
    });
    const totalHistories = await this.prisma.departmentHistory.count({
      where: { employeeId: Number(employeeId) },
    });
    return {
      histories: response,
      totalHistories,
    };
  }
}
