import { Controller } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import {
  contract,
  tsRestHandler,
  TsRestHandler,
  employeeSchema,
} from 'ts-contract';
import { Employee } from 'database';

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
      create: async ({ body }) => {
        try {
          const validatedBody = employeeSchema.omit({ id: true }).parse(body);
          const employee = await this.employeeService.create(
            validatedBody as Employee,
          );
          return {
            status: 201,
            body: employee,
          };
        } catch (error) {
          return {
            status: 400,
            body: { message: error.message, errors: error.errors },
          };
        }
      },
    });
  }
}
