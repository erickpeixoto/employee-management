"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.departmentMethods = exports.departmentSchema = exports.errorResponseSchema = void 0;
const zod_1 = require("zod");
const zod_openapi_1 = require("@anatine/zod-openapi");
(0, zod_openapi_1.extendZodWithOpenApi)(zod_1.z);
const departmentExample = {
    id: 1,
    name: "Engineering",
};
exports.errorResponseSchema = zod_1.z.object({
    message: zod_1.z.string().openapi({ description: "Error message" }),
    errors: zod_1.z.array(zod_1.z.object({
        message: zod_1.z.string(),
        path: zod_1.z.array(zod_1.z.string()),
    })).optional(),
});
exports.departmentSchema = zod_1.z.object({
    id: zod_1.z.union([zod_1.z.number(), zod_1.z.string()]).optional().openapi({
        description: "Department ID",
        example: departmentExample.id,
    }),
    name: zod_1.z.string().openapi({
        description: "Department name",
        example: departmentExample.name,
    }),
});
exports.departmentMethods = {
    getAll: {
        method: "GET",
        path: "/departments/GetAllDepartments",
        responses: {
            200: zod_1.z.array(exports.departmentSchema).openapi({
                description: "List of all departments",
            }),
            400: exports.errorResponseSchema.openapi({ description: "Bad request" }),
            500: exports.errorResponseSchema.openapi({
                description: "Internal server error",
            }),
        },
    },
};
