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
exports.apiClientQuery = exports.apiClient = exports.contract = void 0;
const department_1 = require("./contracts/department");
const employee_1 = require("./contracts/employee");
const core_1 = require("@ts-rest/core");
const react_query_1 = require("@ts-rest/react-query");
const core_2 = require("@ts-rest/core");
__exportStar(require("./contracts"), exports);
const c = (0, core_1.initContract)();
exports.contract = c.router({
    employees: employee_1.employeeMethods,
    departments: department_1.departmentMethods,
}, {
    pathPrefix: "/api",
    strictStatusCodes: true,
});
exports.apiClient = (0, core_2.initClient)(exports.contract, {
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL_API,
    baseHeaders: {},
});
exports.apiClientQuery = (0, react_query_1.initQueryClient)(exports.contract, {
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL_API,
    baseHeaders: {},
});
