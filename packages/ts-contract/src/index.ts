import { departmentMethods } from "./contracts/department";
import { employeeMethods } from "./contracts/employee";
import { initContract } from "@ts-rest/core";
import { initQueryClient } from "@ts-rest/react-query";
import { initClient } from "@ts-rest/core";
export * from "./contracts";

const c = initContract();

export const contract = c.router(
  {
    employees: employeeMethods,
    departments: departmentMethods,
  },
  {
    pathPrefix: "/api",
    strictStatusCodes: true,
  }
);

export const apiClient = initClient(contract, {
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL_API!,
  baseHeaders: {},
});

export const apiClientQuery = initQueryClient(contract, {
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL_API!,
  baseHeaders: {},
});
