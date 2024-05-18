import { z } from "zod";

export const employeeSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  hireDate: z.string(),
  phone: z.string(),
  address: z.string(),
  departmentId: z.number(),
  department: z.object({
    id: z.number(),
    name: z.string(),
  }),
});

export const employeeMethods = {
  getAll: {
    method: "GET",
    path: "/employees/GetAllEmployees",
    responses: {
      200: z.array(employeeSchema),
    },
  },
  create: {
    method: "POST",
    path: "/employees/CreateEmployee",
    body: employeeSchema,
    responses: {
      201: employeeSchema,
    },
  },
  getById: {
    method: "GET",
    path: "/employees/GetEmployeeById/:id",
    responses: {
      200: employeeSchema,
    },
  },
  update: {
    method: "PUT",
    path: "/employees/UpdateEmployee/:id",
    body: z.object({
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      hireDate: z.string().optional(),
      phone: z.string().optional(),
      address: z.string().optional(),
      departmentId: z.number().optional(),
    }),
    responses: {
      200: employeeSchema,
    },
  },
  delete: {
    method: "DELETE",
    path: "/employees/DeleteEmployee/:id",
    body: z.object({
      id: z.number(),
    }),
    responses: {
      204: z.object({ message: z.string() }),
    },
  },
} as const;
