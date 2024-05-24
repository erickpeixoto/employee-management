"use client";

import { apiClientQuery } from "ts-contract";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { Employee } from "ts-contract";
import { useQueryClient } from '@ts-rest/react-query/tanstack';
import { useEffect, useState } from "react";



interface UpdateDepartmentFormProps {
  employee: Employee;
}

export function DepartmentForm({ employee }: UpdateDepartmentFormProps) {
  const [isChanged, setIsChanged] = useState(false);
  const { data: departmentsData, isLoading: departmentsLoading } = apiClientQuery.departments.getAll.useQuery(["departments"]);
  const queryClient = useQueryClient();
  const { control, handleSubmit, watch } = useForm<Employee>({
    defaultValues: {
      departmentId: employee.departmentId || 1,
    },
  });

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "departmentId" && value.departmentId !== employee.departmentId) {
        setIsChanged(true);
      } else {
        setIsChanged(false);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, employee.departmentId]);

  const { mutate } = apiClientQuery.employees.update.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries(["employees", String(employee.id)]);
    },
    onError: (error) => {
      console.error(error);
    },
    
  });

  if (departmentsLoading) {
    return <div>Loading...</div>;
  }

  const departments = departmentsData?.body;
  const processSubmit = (data: Employee) => {
    mutate({
      body: {
        id: Number(employee.id),
        departmentId: Number(data.departmentId),
        firstName: employee.firstName,
        lastName: employee.lastName,
        phone: employee.phone,
        address: employee.address,
        avatar: employee.avatar,
        hireDate: employee.hireDate,
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(processSubmit)} className="mt-6">
      <h3 className="text-xl font-semibold">Update Department</h3>
      <div className="flex items-center gap-4 mt-2">
      <Controller
          name="departmentId"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value ? String(field.value) : ""}
              onValueChange={field.onChange}
            >
              <SelectTrigger className="w-[240px]">
                <SelectValue placeholder="Select a department" />
              </SelectTrigger>
              <SelectContent>
                {departments?.map((department) => (
                  <SelectItem key={department.id} value={String(department.id)}>
                    {department.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
         <Button color={isChanged ? "success" : "outline"} type="submit" disabled={!isChanged}>
          Update
        </Button>
      </div>
    </form>
  );
}
