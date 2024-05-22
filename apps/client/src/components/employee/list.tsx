"use client";

import { useState, useRef } from "react";
import { Avatar, Button, Tooltip } from "@nextui-org/react";
import { Trash2, EyeIcon } from "lucide-react";
import { Employee, LIMIT_DEFAULT } from "ts-contract";
import { Pagination } from "@/components/employee/pagination";
import { apiClientQuery } from "ts-contract";
import { formatHireDate } from "@/utils";
import ModalComponent from "../modal";
import { EmployeeForm } from "./form";
import { useQueryClient } from "@tanstack/react-query";

interface ListEmployeeProps {
  title: string;
}

export function ListEmployee({ title }: ListEmployeeProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const formRef = useRef<{ submit: () => void; isLoading: boolean }>(null);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = apiClientQuery.employees.getAll.useQuery(
    ["employees", currentPage],
    {
      query: { page: String(currentPage), limit: String(LIMIT_DEFAULT) },
    }
  );
  

  if (isLoading) {
    return (
      <div
        className="flex flex-col items-center justify-center w-full h-[300px] border border-border rounded-lg bg-background shadow-lg
      "
      >
        <p>Loading...</p>
      </div>
    );
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSave = () => {
    formRef.current?.submit();
  };

  return (
    <div className="container pt-5">
      <div className="flex justify-between">
        <h1 className="font-semibold">{title}</h1>
        <Button
          color="secondary"
          className="rounded"
          onPress={() => setIsModalOpen(true)}
        >
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
                    <p>Hired Date</p>
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
          {!data?.body.employees.length && (
            <li className="text-center py-4">No employees found</li>
          )}
        </ul>

        {data?.body.employees.length! > 0 && (
          <Pagination
            total={
              Math.ceil((data?.body.totalEmployees ?? 0) / LIMIT_DEFAULT) || 1
            }
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        )}
      </div>
      <ModalComponent
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="New Employee"
        onSave={handleSave}
        isLoading={formRef.current?.isLoading || false}
      >
        <EmployeeForm
          ref={formRef}
          onClose={() => {
            setIsModalOpen(false);
            setCurrentPage(1);
            queryClient.invalidateQueries(["employees"]);
          }}
        />
      </ModalComponent>
    </div>
  );
}
