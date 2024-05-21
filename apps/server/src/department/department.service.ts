import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class DepartmentService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    const response = await this.prisma.department.findMany();
    return response;
  }
}
