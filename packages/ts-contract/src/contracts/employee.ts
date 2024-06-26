import { z } from "zod";
import { extendZodWithOpenApi } from "@anatine/zod-openapi";

extendZodWithOpenApi(z);
export const LIMIT_DEFAULT = 5;
const employeeExample = {
  id: 1,
  firstName: "Will",
  lastName: "Smith",
  hireDate: "2023-05-18T00:00:00.000Z",
  phone: "555-555-5555",
  address: "123 Main St",
  departmentId: 1,
  department: {
    id: 1,
    name: "Engineering",
  },
};

export const errorResponseSchema = z.object({
  message: z.string().openapi({ description: "Error message" }),
  errors: z.array(
    z.object({
      message: z.string(),
      path: z.array(z.string()),
    })
  ).optional(),
});

const departmentSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const departmentHistorySchema = z.object({
  id: z.number(),
  employeeId: z.union([z.number(), z.string()]).openapi({ description: 'Employee ID', example: 1 }),
  oldDepartmentId: z.number().openapi({ description: 'Old department ID', example: 1 }),
  newDepartmentId: z.number().openapi({ description: 'New department ID', example: 2 }),
  changeDate: z.date().openapi({ description: 'Change date', example: employeeExample.hireDate }),
  oldDepartment: departmentSchema,
  newDepartment: departmentSchema,
});

export const employeeSchema = z.object({
  id: z.union([z.number(), z.string()]).optional().openapi({ description: 'Employee ID', example: 1 }),
  isActive: z.boolean().default(true).openapi({ description: 'Is employee archived', example: false }),
  avatar: z.string().openapi({ description: 'Avatar URL', example: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' }),
  firstName: z.string().min(1).openapi({ description: 'First name of the employee', example: 'John' }),
  lastName: z.string().min(1).openapi({ description: 'Last name of the employee', example: 'Doe' }),
  hireDate: z.preprocess((arg) => {
    if (typeof arg === "string" || arg instanceof Date) {
      return new Date(arg);
    }
  }, z.date()).openapi({ description: 'Hire date of the employee', example: employeeExample.hireDate }),
  phone: z.string().openapi({ description: 'Phone number of the employee', example: '555-555-5555' }),
  address: z.string().openapi({ description: 'Address of the employee', example: '123 Main St' }),
  departmentId: z.number({
    message: 'Department ID of the employee'
  }).min(1).openapi({ description: 'Department ID of the employee', example: 2 }),
  department: departmentSchema.optional(),
  departmentHistories: z.array(departmentHistorySchema).optional(),
});

export type Employee = z.infer<typeof employeeSchema>;

export const paginationSchema = z.object({
  page: z.preprocess((arg) => parseInt(arg as string, 10), z.number()).optional().openapi({ description: 'Page number', example: 1 }),
  limit: z.preprocess((arg) => parseInt(arg as string, 10), z.number()).optional().openapi({ description: 'Number of items per page', example: 10 }),
});

export const employeeMethods = {
  getAll: {
    method: "GET",
    path: "/employees/GetAllEmployees",
    query: paginationSchema,
    responses: {
      200: z.object({
        employees: z.array(employeeSchema).openapi({
          description: "List of employees",
        }),
        totalEmployees: z.number().openapi({
          description: "Total number of employees",
        }),
      }),
      400: errorResponseSchema.openapi({ description: "Bad request" }),
      500: errorResponseSchema.openapi({
        description: "Internal server error",
      }),
    },
  },
  getOne: {
    method: "GET",
    path: "/employees/GetEmployeeById",
    query: z.object({
      id: z.union([z.number(), z.string()]).openapi({ description: 'Employee ID', example: 1 }),
    }),
    responses: {
      200: employeeSchema.openapi({
        description: "Employee found",
      }),
      400: errorResponseSchema.openapi({ description: "Bad request" }),
      404: errorResponseSchema.openapi({ description: "Employee not found" }),
      500: errorResponseSchema.openapi({
        description: "Internal server error",
      }),
    },
  },
  getDepartmentHistory: {
    method: "GET",
    path: "/employees/GetDepartmentHistory",
    query: paginationSchema.merge(
      departmentHistorySchema.pick({ employeeId: true })
    ),
    responses: {
      200: z.object({
        histories: z.array(departmentHistorySchema).openapi({
          description: "Department history found",
        }),
        totalHistories: z.number().openapi({
          description: "Total number of histories",
        }),
      }),
      400: errorResponseSchema.openapi({ description: "Bad request" }),
      404: errorResponseSchema.openapi({ description: "Employee not found" }),
      500: errorResponseSchema.openapi({
        description: "Internal server error",
      }),
    },
  },
  create: {
    method: "POST",
    path: "/employees/CreateEmployee",
    body: employeeSchema.omit({ id: true }),
    responses: {
      201: employeeSchema.openapi({
        description: "Employee created",
      }),
      400: errorResponseSchema.openapi({ description: "Bad request" }),
      500: errorResponseSchema.openapi({
        description: "Internal server error",
      }),
    },
  },
  update: {
    method: "PUT",
    path: "/employees/UpdateEmployee",
    body: employeeSchema.extend({
      id: z.number().openapi({ description: 'Employee ID', example: 1 }),
    }),
    responses: {
      200: employeeSchema.openapi({
        description: "Employee updated",
      }),
      400: errorResponseSchema.openapi({ description: "Bad request" }),
      500: errorResponseSchema.openapi({
        description: "Internal server error",
      }),
    },
  },
  delete: {
    method: "DELETE",
    path: "/employees/DeleteEmployee",
    body: z.object({
      id: z.number().openapi({ description: 'Employee ID', example: 1 }),
    }),
    responses: {
      200: z.object({ message: z.string() }).openapi({ description: "Employee deleted" }),
      400: errorResponseSchema.openapi({ description: "Bad request" }),
      404: errorResponseSchema.openapi({ description: "Employee not found" }),
      500: errorResponseSchema.openapi({
        description: "Internal server error",
      }),
    },
  },
} as const;
