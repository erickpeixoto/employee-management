"use client";

import { useState } from "react";
import { apiClientQuery } from "ts-contract";
import { formatHireDate } from "@/utils";
import { Button } from "@/components/ui/button";
import { DepartmentForm } from "@/components/employee/department/form";
import { HistoryList } from "@/components/employee/department/history-list";
import { useQueryClient } from "@ts-rest/react-query/tanstack";

interface DetailsProps {
  id: string;
}

export function Details({ id }: DetailsProps) {
  const { data: employeeData, isLoading: employeeLoading } =
    apiClientQuery.employees.getOne.useQuery(["employees", id], {
      query: { id },
    });

  const employee = employeeData?.body;
  const queryClient = useQueryClient();
  const [isActive, setIsActive] = useState(employee?.isActive);

  const { mutate } = apiClientQuery.employees.update.useMutation({
    onSuccess: () => {
      setIsActive((prev) => !prev);
      queryClient.invalidateQueries(["employees", id]);
      queryClient.invalidateQueries(["employees"]);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const toggleActiveStatus = () => {
    const newStatus = !isActive;
    mutate({
      body: {
        id: Number(id),
        isActive: newStatus,
        avatar: employee?.avatar!,
        firstName: employee?.firstName!,
        lastName: employee?.lastName!,
        phone: employee?.phone!,
        address: employee?.address!,
        departmentId: employee?.departmentId!,
        hireDate: employee?.hireDate!,
      },
    });
  };

  if (employeeLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col h-[80vh] w-full p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="relative w-32 h-32 bg-gray-200 rounded-lg">
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
            {!isActive && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white font-bold">
                Inactive
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
          <Button
            color={isActive ? "danger" : "success"}
            className="mt-2"
            onClick={toggleActiveStatus}
          >
            {isActive ? "Deactivate" : "Activate"}
          </Button>
        </div>
      </div>
      {employee && <DepartmentForm employee={employee} />}
      <div className="mt-6">
        <h3 className="text-xl font-semibold">Department History</h3>
        {employee?.departmentHistories && (
          <HistoryList departmentHistories={employee.departmentHistories} />
        )}
      </div>
    </div>
  );
}
