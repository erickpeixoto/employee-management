import { z } from "zod";

export const departmentSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export type Department = z.infer<typeof departmentSchema>;

export const departmentMethods = {
  getAll: {
    method: "GET",
    path: "/departments/GetAllDepartments",
    responses: {
      200: z.array(departmentSchema),
    },
  },
} as const