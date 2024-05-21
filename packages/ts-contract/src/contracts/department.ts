import { z } from "zod";
import { extendZodWithOpenApi } from "@anatine/zod-openapi";

extendZodWithOpenApi(z);
const departmentExample = {
  id: 1,
  name: "Engineering",
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
export const departmentSchema = z.object({
  id: z.union([z.number(), z.string()]).optional().openapi({
    description: "Department ID",
    example: departmentExample.id,
  }),
  name: z.string().openapi({
    description: "Department name",
    example: departmentExample.name,
  }),
});

export type Department = z.infer<typeof departmentSchema>;


export const departmentMethods = {
  getAll: {
    method: "GET",
    path: "/departments/GetAllDepartments",
    responses: {
      200: z.array(departmentSchema).openapi({
        description: "List of all departments",
      }),
      400: errorResponseSchema.openapi({ description: "Bad request" }),
      500: errorResponseSchema.openapi({
        description: "Internal server error",
      }),
    },
  },
} as const