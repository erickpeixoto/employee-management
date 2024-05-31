import { Controller } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import {
  contract,
  employeeSchema,
  handleError,
  departmentHistorySchema,
  paginationSchema,
  formattedErrors,
} from 'ts-contract';
import { Employee } from 'ts-contract';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { ZodError } from 'zod';

@Controller()
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @TsRestHandler(contract.employees)
  async handler() {
    return tsRestHandler(contract.employees, {
      getAll: async ({ query }) => {
        console.log(query);
        console.log("METHOD GET ALL");
        try {
          const validatedQuery = paginationSchema.parse(query);
          const { page, limit } = validatedQuery;
          const result = await this.employeeService.getAll(
            Number(page),
            Number(limit),
          );
          return {
            status: 200,
            body: result,
          };
        } catch (error) {
          if (error instanceof ZodError) {
            return {
              status: 400,
              body: { message: 'Bad request', errors: formattedErrors as any },
            };
          }
          console.log(error);
          return { status: 500 as const, body: { message: 'Internal server error' } };
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
          if (error instanceof ZodError) {
            return {
              status: 400,
              body: { message: 'Bad request', errors: formattedErrors as any },
            };
          }
            return { status: 500, body: { message: 'Internal server error' } };
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
            status: 200,
            body: response,
          };
        } catch (error) {
          return handleError(error);
        }
      },
      getDepartmentHistory: async ({ query }) => {
        try {
          const validatedQuery = paginationSchema
            .merge(departmentHistorySchema.pick({ employeeId: true }))
            .parse(query);
          const { employeeId, page, limit } = validatedQuery;
          const history = await this.employeeService.getDepartmentHistory(
            Number(employeeId),
            Number(page),
            Number(limit),
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
