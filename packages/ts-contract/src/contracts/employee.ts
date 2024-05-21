import { z } from "zod";
import { extendZodWithOpenApi } from "@anatine/zod-openapi";

extendZodWithOpenApi(z);

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
export const employeeSchema = z.object({
  id: z.union([z.number(), z.string()]).optional().openapi({ description: 'Employee ID', example: 1 }),
  firstName: z.string().openapi({ description: 'First name of the employee', example: 'John' }),
  lastName: z.string().openapi({ description: 'Last name of the employee', example: 'Doe' }),
  hireDate: z.preprocess((arg) => {
    if (typeof arg === "string" || arg instanceof Date) {
      return new Date(arg);
    }
  }, z.date()).openapi({ description: 'Hire date of the employee', example: employeeExample.hireDate }),
  phone: z.string().openapi({ description: 'Phone number of the employee', example: '555-555-5555' }),
  address: z.string().openapi({ description: 'Address of the employee', example: '123 Main St' }),
  departmentId: z.number().openapi({ description: 'Department ID of the employee', example: 2 }),
  department: z.object({
    id: z.number().openapi({ description: 'Department ID', example: 2 }),
    name: z.string().openapi({ description: 'Department name', example: 'Engineering' }),
  }).optional(),
});


export const employeeMethods = {
  getAll: {
    method: "GET",
    path: "/employees/GetAllEmployees",
    responses: {
      200: z.array(employeeSchema).openapi({
        description: "List of all employees",
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
      id: z.union([z.number(), z.string()]).openapi({ description: 'Employee ID', example: 1}),
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
      204: z.object({ message: z.string() }).openapi({ description: "Employee deleted" }),
      400: errorResponseSchema.openapi({ description: "Bad request" }),
      404: errorResponseSchema.openapi({ description: "Employee not found" }),
      500: errorResponseSchema.openapi({
        description: "Internal server error",
      }),
    },
  },
  getHistory: {
    method: "GET",
    path: "/employees/GetEmployeeHistory",
    query: z.object({
      employeeId: z.number().openapi({ description: 'Employee ID', example: 1 }),
    }),
    responses: {
      200: z.array(z.object({
        id: z.number().openapi({ description: 'History ID', example: 1 }),
        employeeId: z.number().openapi({ description: 'Employee ID', example: 1 }),
        oldDepartmentId: z.number().openapi({ description: 'Old Department ID', example: 2 }),
        newDepartmentId: z.number().openapi({ description: 'New Department ID', example: 3 }),
        changeDate: z.string().openapi({ description: 'Change Date', example: '2023-06-01T00:00:00.000Z' }),
      })).openapi({ description: 'Department change history' }),
      400: errorResponseSchema.openapi({ description: "Bad request" }),
      404: errorResponseSchema.openapi({ description: "Employee not found" }),
      500: errorResponseSchema.openapi({
        description: "Internal server error",
      }),
    },
  },
} as const;