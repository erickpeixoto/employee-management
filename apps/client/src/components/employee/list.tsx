"use client";

import { useState, useEffect } from "react";
import { Avatar, Button, Tooltip } from "@nextui-org/react";
import { Trash2, EyeIcon } from "lucide-react";
import { Employee, LIMIT_DEFAULT } from "ts-contract";
import { Pagination } from "@/components/employee/pagination";
import { apiClientQuery } from "ts-contract";
import { formatHireDate } from "@/utils";

interface ListEmployeeProps {
  title: string;
}

export function ListEmployee({ title }: ListEmployeeProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError } = apiClientQuery.employees.getAll.useQuery(
    ['employees', currentPage],
    {
      query: { page: String(currentPage), limit: String(LIMIT_DEFAULT) },
    }
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container pt-5">
      <div className="flex justify-between">
        <h1 className="font-semibold">{title}</h1>
        <Button color="secondary" className="rounded">
          New Employee
        </Button>
      </div>
      <div className="mt-6 border border-border rounded-lg bg-background shadow-lg p-4 items-end flex flex-col">
        <ul className="w-full">
          {data?.body.employees.map((employee: Employee) => (
            <li key={employee.id} className="border-b py-4">
              <div className="flex justify-between items-center">
                <div className="flex gap-3 items-center">
                  <Avatar
                    isBordered
                    src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                    size="md"
                    className="md:w-[60px] md:h-[60px] text-large"
                  />
                  <div>
                    <h2 className="font-semibold flex gap-x-1">
                      {employee.firstName} {employee.lastName}
                      <span>({employee.department?.name})</span>
                    </h2>
                    <p>
                      Hired Date 
                    </p>
                    <p className="text-gray-500 text-sm">
                    {formatHireDate(employee.hireDate)}
                    </p>
                  </div>
                </div>
                <div className="flex flex-row gap-x-3">
                  <Tooltip content="View employee">
                    <span className="text-lg text-success cursor-pointer active:opacity-50">
                      <EyeIcon />
                    </span>
                  </Tooltip>
                  <Tooltip color="danger" content="Delete employee">
                    <span className="text-lg text-danger cursor-pointer active:opacity-50">
                      <Trash2 />
                    </span>
                  </Tooltip>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <Pagination
          total={Number(data?.body.totalEmployees) / LIMIT_DEFAULT || 1} 
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
