import { z } from "zod";
export declare const employeeSchema: z.ZodObject<{
    id: z.ZodNumber;
    firstName: z.ZodString;
    lastName: z.ZodString;
    hireDate: z.ZodString;
    phone: z.ZodString;
    address: z.ZodString;
    departmentId: z.ZodNumber;
    department: z.ZodObject<{
        id: z.ZodNumber;
        name: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: number;
        name: string;
    }, {
        id: number;
        name: string;
    }>;
}, "strip", z.ZodTypeAny, {
    id: number;
    firstName: string;
    lastName: string;
    hireDate: string;
    phone: string;
    address: string;
    departmentId: number;
    department: {
        id: number;
        name: string;
    };
}, {
    id: number;
    firstName: string;
    lastName: string;
    hireDate: string;
    phone: string;
    address: string;
    departmentId: number;
    department: {
        id: number;
        name: string;
    };
}>;
