"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formattedErrors = exports.errorResponseSchema = exports.handleError = void 0;
const zod_1 = require("zod");
__exportStar(require("./employee"), exports);
__exportStar(require("./department"), exports);
function handleError(error) {
    if (error instanceof zod_1.ZodError) {
        const formattedErrors = error.errors.map((err) => ({
            ...err,
            path: err.path.map(String),
        }));
        return {
            status: 400,
            body: { message: "Validation failed", errors: formattedErrors },
        };
    }
    return {
        status: 500,
        body: { message: error.message },
    };
}
exports.handleError = handleError;
exports.errorResponseSchema = zod_1.z.object({
    message: zod_1.z.string().openapi({ description: "Error message" }),
    errors: zod_1.z
        .array(zod_1.z.object({
        message: zod_1.z.string(),
        path: zod_1.z.array(zod_1.z.string()),
    }))
        .optional(),
});
const formattedErrors = (error) => error.errors.map((err) => ({
    message: err.message,
    path: err.path.map(String),
}));
exports.formattedErrors = formattedErrors;
