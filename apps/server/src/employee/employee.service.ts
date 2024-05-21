import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Employee } from 'database';

@Injectable()
export class EmployeeService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    const reponse = this.prisma.employee.findMany({
      include: {
        department: true,
      },
    });
    return (await reponse).map((employee) => employee);
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
    const { id, firstName, lastName, hireDate, phone, address, departmentId } =
      employee;
    const response = await this.prisma.employee.update({
      where: { id },
      data: { firstName, lastName, hireDate, phone, address, departmentId },
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
}
