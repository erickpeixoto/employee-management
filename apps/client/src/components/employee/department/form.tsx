"use client";

import { apiClientQuery } from "ts-contract";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { Employee } from "ts-contract";

interface UpdateDepartmentFormProps {
  employee: Employee;
}

export function DepartmentForm({ employee }: UpdateDepartmentFormProps) {
  const { data: departmentsData, isLoading: departmentsLoading } = apiClientQuery.departments.getAll.useQuery(["departments"]);

  const { control, handleSubmit } = useForm<Employee>({
    defaultValues: {
      departmentId: employee.departmentId || 1,
    },
  });

  const { mutate } = apiClientQuery.employees.update.useMutation({
    onSuccess: () => {
      console.log("Department updated");
    },
    onError: (error) => {
      console.error(error);
    }
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
        <Button variant="outline" type="submit">
          Update
        </Button>
      </div>
    </form>
  );
}
