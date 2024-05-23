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
import { useRouter, useSearchParams } from "next/navigation";

interface ListEmployeeProps {
  title: string;
}

export function ListEmployee({ title }: ListEmployeeProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const formRef = useRef<{ submit: () => void; isLoading: boolean }>(null);
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;

  const { data, isLoading } = apiClientQuery.employees.getAll.useQuery(
    ["employees", page],
    {
      query: { page: String(page), limit: String(LIMIT_DEFAULT) },
    }
  );
  const totalOfPages =
    Math.ceil((data?.body.totalEmployees ?? 0) / LIMIT_DEFAULT) ?? 1;

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
    router.push(`?page=${page}`);
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
                    src={
                      employee.avatar ??
                      "https://ucarecdn.com/dbf239dd-1282-46d6-af29-092bc555fb9e"
                    }
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
            total={totalOfPages}
            currentPage={page}
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
            handlePageChange(totalOfPages);
            queryClient.invalidateQueries(["employees"]);
          }}
        />
      </ModalComponent>
    </div>
  );
}
