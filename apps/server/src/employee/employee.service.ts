import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Employee } from 'database';

@Injectable()
export class EmployeeService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    const reponse = await this.prisma.employee.findMany({
      include: {
        department: true,
      },
    });
    return reponse;
  }

  async create(employee: Employee) {
    const { firstName, lastName, hireDate, phone, address, departmentId } =
      employee;
    const response = await this.prisma.employee.create({
      data: { firstName, lastName, hireDate, phone, address, departmentId },
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
      data: {
        firstName: employee.firstName,
        lastName: employee.lastName,
        hireDate: employee.hireDate,
        phone: employee.phone,
        address: employee.address,
        departmentId: employee.departmentId,
      },
    });

    return response;
  }

  async getOne(id: number) {
    const response = await this.prisma.employee.findUnique({
      where: { id },
      include: {
        department: true,
      },
    });
    if (!response) {
      throw new Error('Employee not found');
    }
    return response;
  }

  async delete(id: number) {
    const response = await this.prisma.employee.delete({
      where: { id },
    });
    if (!response) {
      throw new Error('Employee not found');
    }
    return {
      message: 'Employee deleted successfully',
    };
  }

  async getDepartmentHistory(employeeId: number) {
    const response = await this.prisma.departmentHistory.findMany({
      where: { employeeId: Number(employeeId) },
      include: {
        oldDepartment: true,
        newDepartment: true,
      },
    });
    return response;
  }

}
