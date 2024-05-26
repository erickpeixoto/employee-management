import { ZodError, z } from "zod";

export * from "./employee";
export * from "./department";

export function handleError(error: any) {
  if (error instanceof ZodError) {
    const formattedErrors = error.errors.map((err) => ({
      ...err,
      path: err.path.map(String),
    }));
    return {
      status: 400 as const,
      body: { message: "Validation failed", errors: formattedErrors },
    };
  }
  return {
    status: 500 as const,
    body: { message: error.message },
  };
}

export const errorResponseSchema = z.object({
  message: z.string().openapi({ description: "Error message" }),
  errors: z
    .array(
      z.object({
        message: z.string(),
        path: z.array(z.string()),
      })
    )
    .optional(),
});

export const formattedErrors = (error: ZodError) =>
  error.errors.map((err) => ({
    message: err.message,
    path: err.path.map(String),
  }));
