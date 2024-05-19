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
    return (await reponse).map((employee) => ({
      ...employee,
      hireDate: employee.hireDate.toISOString(),
    }));
  }
}
