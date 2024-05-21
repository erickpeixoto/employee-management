import { Controller } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import {
  contract,
  tsRestHandler,
  TsRestHandler,
  employeeSchema,
  handleError,
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
          return handleError(error);
        }
      },
      getOne: async ({ query }) => {
        try {
          const queryWithNumberId = { ...query, id: Number(query.id) };
          const validatedQuery = employeeSchema.pick({ id: true }).parse(queryWithNumberId);
            const employee = await this.employeeService.getOne(validatedQuery.id);
          return {
            status: 200,
            body: employee,
          };
        } catch (error) {
          return handleError(error);
        }
      },
      create: async ({ body }) => {
        try {
          const validatedBody = employeeSchema.omit({ id: true }).parse(body);
          const employee = await this.employeeService.create(validatedBody as Employee);
          return {
            status: 201,
            body: employee,
          };
        } catch (error) {
          return handleError(error);
        }
      },
      update: async ({ body }) => {
        try {
          const validatedBody = employeeSchema.parse(body);
          const employee = await this.employeeService.update(validatedBody);
          return {
            status: 200,
            body: employee,
          };
        } catch (error) {
          return handleError(error);
        }
      },
    });
  }
}