"use client";

import { apiClientQuery } from "ts-contract";
import { formatHireDate } from "@/utils";
import { Button } from "@/components/ui/button";
import { HistoryList } from "@/components/employee/department/history-list";
import { DepartmentForm } from "@/components/employee/department/form";

interface DetailsProps {
  id: string;
}
export function Details({ id }: DetailsProps) {
  const { data: employeeData, isLoading: employeeLoading } =
    apiClientQuery.employees.getOne.useQuery(["employees", id], {
      query: { id },
    });

  if (employeeLoading) {
    return <div>Loading...</div>;
  }
  const employee = employeeData?.body;

  return (
    <div className="flex flex-col min-h-[800px] w-full p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-32 h-32 bg-gray-200 rounded-lg">
            {employee?.avatar ? (
              <img
                src={employee.avatar}
                alt={`${employee.firstName} ${employee.lastName}`}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                No Image
              </div>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{`${employee?.firstName} ${employee?.lastName}`}</h2>
            <p className="text-gray-600">{employee?.department?.name}</p>
            <p className="text-gray-600">{employee?.phone}</p>
            <p className="text-gray-600">{employee?.address}</p>
          </div>
        </div>
        <div>
          <p className="text-lg font-semibold">Hire Date</p>
          <p className="text-gray-600">{formatHireDate(employee?.hireDate!)}</p>
          <Button variant="secondary" className="mt-2">
            Deactivate
          </Button>
        </div>
      </div>
      <DepartmentForm employee={employee!} />
      <div className="mt-6">
        <h3 className="text-xl font-semibold">Department History</h3>
        <HistoryList departmentHistories={employee?.departmentHistories} />
      </div>
    </div>
  );
}
