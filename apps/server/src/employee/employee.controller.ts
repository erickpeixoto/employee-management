import { Controller } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { contract, tsRestHandler, TsRestHandler } from 'ts-contract';

@Controller()
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @TsRestHandler(contract.employees)
  async handler() {
    return tsRestHandler(contract.employees, {
      getAll: async () => {
        try {
          const employees = await this.employeeService.getAll();
          return {
            status: 200,
            body: employees,
          };
        } catch (error) {
          return {
            status: 500,
            body: { message: error.message },
          };
        }
      },
    });
  }
}
