import { Controller } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import {
  contract,
  tsRestHandler,
  TsRestHandler,
  employeeSchema,
  handleError,
  departmentHistorySchema,
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
          const validatedQuery = employeeSchema.pick({ id: true }).parse(query);
          const employee = await this.employeeService.getOne(
            Number(validatedQuery.id),
          );
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
          const employee = await this.employeeService.create(
            validatedBody as Employee,
          );
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
          const parsedBody = { ...validatedBody, id: Number(validatedBody.id) };
          const employee = await this.employeeService.update(parsedBody);
          return {
            status: 200,
            body: employee,
          };
        } catch (error) {
          return handleError(error);
        }
      },
      delete: async ({ body }) => {
        try {
          const validatedQuery = employeeSchema.pick({ id: true }).parse(body);
          const response = await this.employeeService.delete(
            validatedQuery.id as number,
          );
          return {
            status: 204,
            body: response,
          };
        } catch (error) {
          return handleError(error);
        }
      },
      getDepartmentHistory: async ({ query }) => {
        try {
          const validatedQuery = departmentHistorySchema.pick({ employeeId: true }).parse(query);
          const history = await this.employeeService.getDepartmentHistory(
            validatedQuery.employeeId as number,
          );
          return {
            status: 200,
            body: history,
          };
        } catch (error) {
          return handleError(error);
        }
      },
    });
  }
}
