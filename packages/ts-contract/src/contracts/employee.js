"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeeMethods = exports.paginationSchema = exports.employeeSchema = exports.departmentHistorySchema = exports.errorResponseSchema = exports.LIMIT_DEFAULT = void 0;
const zod_1 = require("zod");
const zod_openapi_1 = require("@anatine/zod-openapi");
(0, zod_openapi_1.extendZodWithOpenApi)(zod_1.z);
exports.LIMIT_DEFAULT = 5;
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
exports.errorResponseSchema = zod_1.z.object({
    message: zod_1.z.string().openapi({ description: "Error message" }),
    errors: zod_1.z.array(zod_1.z.object({
        message: zod_1.z.string(),
        path: zod_1.z.array(zod_1.z.string()),
    })).optional(),
});
const departmentSchema = zod_1.z.object({
    id: zod_1.z.number(),
    name: zod_1.z.string(),
});
exports.departmentHistorySchema = zod_1.z.object({
    id: zod_1.z.number(),
    employeeId: zod_1.z.union([zod_1.z.number(), zod_1.z.string()]).openapi({ description: 'Employee ID', example: 1 }),
    oldDepartmentId: zod_1.z.number().openapi({ description: 'Old department ID', example: 1 }),
    newDepartmentId: zod_1.z.number().openapi({ description: 'New department ID', example: 2 }),
    changeDate: zod_1.z.date().openapi({ description: 'Change date', example: employeeExample.hireDate }),
    oldDepartment: departmentSchema,
    newDepartment: departmentSchema,
});
exports.employeeSchema = zod_1.z.object({
    id: zod_1.z.union([zod_1.z.number(), zod_1.z.string()]).optional().openapi({ description: 'Employee ID', example: 1 }),
    isActive: zod_1.z.boolean().default(true).openapi({ description: 'Is employee archived', example: false }),
    avatar: zod_1.z.string().openapi({ description: 'Avatar URL', example: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' }),
    firstName: zod_1.z.string().min(1).openapi({ description: 'First name of the employee', example: 'John' }),
    lastName: zod_1.z.string().min(1).openapi({ description: 'Last name of the employee', example: 'Doe' }),
    hireDate: zod_1.z.preprocess((arg) => {
        if (typeof arg === "string" || arg instanceof Date) {
            return new Date(arg);
        }
    }, zod_1.z.date()).openapi({ description: 'Hire date of the employee', example: employeeExample.hireDate }),
    phone: zod_1.z.string().openapi({ description: 'Phone number of the employee', example: '555-555-5555' }),
    address: zod_1.z.string().openapi({ description: 'Address of the employee', example: '123 Main St' }),
    departmentId: zod_1.z.number({
        message: 'Department ID of the employee'
    }).min(1).openapi({ description: 'Department ID of the employee', example: 2 }),
    department: departmentSchema.optional(),
    departmentHistories: zod_1.z.array(exports.departmentHistorySchema).optional(),
});
exports.paginationSchema = zod_1.z.object({
    page: zod_1.z.preprocess((arg) => parseInt(arg, 10), zod_1.z.number()).optional().openapi({ description: 'Page number', example: 1 }),
    limit: zod_1.z.preprocess((arg) => parseInt(arg, 10), zod_1.z.number()).optional().openapi({ description: 'Number of items per page', example: 10 }),
});
exports.employeeMethods = {
    getAll: {
        method: "GET",
        path: "/employees/GetAllEmployees",
        query: exports.paginationSchema,
        responses: {
            200: zod_1.z.object({
                employees: zod_1.z.array(exports.employeeSchema).openapi({
                    description: "List of employees",
                }),
                totalEmployees: zod_1.z.number().openapi({
                    description: "Total number of employees",
                }),
            }),
            400: exports.errorResponseSchema.openapi({ description: "Bad request" }),
            500: exports.errorResponseSchema.openapi({
                description: "Internal server error",
            }),
        },
    },
    getOne: {
        method: "GET",
        path: "/employees/GetEmployeeById",
        query: zod_1.z.object({
            id: zod_1.z.union([zod_1.z.number(), zod_1.z.string()]).openapi({ description: 'Employee ID', example: 1 }),
        }),
        responses: {
            200: exports.employeeSchema.openapi({
                description: "Employee found",
            }),
            400: exports.errorResponseSchema.openapi({ description: "Bad request" }),
            404: exports.errorResponseSchema.openapi({ description: "Employee not found" }),
            500: exports.errorResponseSchema.openapi({
                description: "Internal server error",
            }),
        },
    },
    getDepartmentHistory: {
        method: "GET",
        path: "/employees/GetDepartmentHistory",
        query: exports.paginationSchema.merge(exports.departmentHistorySchema.pick({ employeeId: true })),
        responses: {
            200: zod_1.z.object({
                histories: zod_1.z.array(exports.departmentHistorySchema).openapi({
                    description: "Department history found",
                }),
                totalHistories: zod_1.z.number().openapi({
                    description: "Total number of histories",
                }),
            }),
            400: exports.errorResponseSchema.openapi({ description: "Bad request" }),
            404: exports.errorResponseSchema.openapi({ description: "Employee not found" }),
            500: exports.errorResponseSchema.openapi({
                description: "Internal server error",
            }),
        },
    },
    create: {
        method: "POST",
        path: "/employees/CreateEmployee",
        body: exports.employeeSchema.omit({ id: true }),
        responses: {
            201: exports.employeeSchema.openapi({
                description: "Employee created",
            }),
            400: exports.errorResponseSchema.openapi({ description: "Bad request" }),
            500: exports.errorResponseSchema.openapi({
                description: "Internal server error",
            }),
        },
    },
    update: {
        method: "PUT",
        path: "/employees/UpdateEmployee",
        body: exports.employeeSchema.extend({
            id: zod_1.z.number().openapi({ description: 'Employee ID', example: 1 }),
        }),
        responses: {
            200: exports.employeeSchema.openapi({
                description: "Employee updated",
            }),
            400: exports.errorResponseSchema.openapi({ description: "Bad request" }),
            500: exports.errorResponseSchema.openapi({
                description: "Internal server error",
            }),
        },
    },
    delete: {
        method: "DELETE",
        path: "/employees/DeleteEmployee",
        body: zod_1.z.object({
            id: zod_1.z.number().openapi({ description: 'Employee ID', example: 1 }),
        }),
        responses: {
            200: zod_1.z.object({ message: zod_1.z.string() }).openapi({ description: "Employee deleted" }),
            400: exports.errorResponseSchema.openapi({ description: "Bad request" }),
            404: exports.errorResponseSchema.openapi({ description: "Employee not found" }),
            500: exports.errorResponseSchema.openapi({
                description: "Internal server error",
            }),
        },
    },
};
