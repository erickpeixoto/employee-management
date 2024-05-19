import { z } from "zod";
import { extendZodWithOpenApi } from "@anatine/zod-openapi";

extendZodWithOpenApi(z);

const employeeSchema = z.object({
  id: z.number().openapi({ description: 'Employee ID', example: 1 }),
  firstName: z.string().openapi({ description: 'First name of the employee', example: 'John' }),
  lastName: z.string().openapi({ description: 'Last name of the employee', example: 'Doe' }),
  hireDate: z.string().openapi({ description: 'Hire date of the employee', example: '2023-05-18' }),
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
      500: z.object({
        message: z.string().openapi({ description: "Internal server error" }),
      }).openapi({
        description: "Internal server error",
      }),
    },
  },
} as const;
