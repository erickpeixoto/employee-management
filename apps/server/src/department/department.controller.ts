import { Controller } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { tsRestHandler, TsRestHandler, contract } from 'ts-contract';

@Controller()
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @TsRestHandler(contract.departments)
  async handler() {
    return tsRestHandler(contract.departments, {
      getAll: async () => {
        try {
          const departments = await this.departmentService.getAll();
          return {
            status: 200,
            body: departments,
          };
        } catch (error) {
          return {
            status: 500,
            body: error.message,
          };
        }
      },
    });
  }
}
