"use client";

import React, { useState, forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Employee, employeeSchema } from "ts-contract";
import { apiClientQuery } from "ts-contract";

interface EmployeeFormProps {
  onClose: () => void;
}

export const EmployeeForm = forwardRef(
  ({ onClose }: EmployeeFormProps, ref) => {
    const form = useForm<Employee>({
      resolver: zodResolver(
        employeeSchema.omit({ id: true, department: true })
      ),
      defaultValues: {
        firstName: "",
        lastName: "",
        phone: "",
        address: "",
        hireDate: new Date(),
        departmentId: 1,
      },
    });

    const { data: departments, isLoading: loadingDepartments } =
      apiClientQuery.departments.getAll.useQuery(["deparments"]);

    const { mutate, isLoading } = apiClientQuery.employees.create.useMutation({
      onSuccess: () => {
        form.reset();
        onClose();
      },
      onError: (error) => {
        console.error("Error creating employee:", error);
      },
    });

    useImperativeHandle(ref, () => ({
      submit: form.handleSubmit((values) => mutate({ body: values })),
      isLoading,
    }));

    return (
      <main>
        <Form {...form}>
          <form className="space-y-4">
            <FormField
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>Avatar</FormLabel>
                  <FormControl>
                    <Input
                      id={field.name}
                      placeholder="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.avatar?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>First Name</FormLabel>
                  <FormControl>
                    <Input id={field.name} placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.firstName?.message}
                  </FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>Last Name</FormLabel>
                  <FormControl>
                    <Input id={field.name} placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.lastName?.message}
                  </FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>Phone</FormLabel>
                  <FormControl>
                    <Input
                      id={field.name}
                      placeholder="555-555-5555"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.phone?.message}
                  </FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>Address</FormLabel>
                  <FormControl>
                    <Input
                      id={field.name}
                      placeholder="123 Main St"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.address?.message}
                  </FormMessage>
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel htmlFor="hireDate">Hire Date</FormLabel>
              <FormControl>
                <Input
                  id="hireDate"
                  type="date"
                  {...form.register("hireDate")}
                />
              </FormControl>
              <FormMessage>
                {form.formState.errors.hireDate?.message}
              </FormMessage>
            </FormItem>

            <FormField
              control={form.control}
              name="departmentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>Department</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value ? String(field.value) : ""}
                      onValueChange={(value) => field.onChange(Number(value))}
                      disabled={loadingDepartments}
                    >
                      <SelectTrigger className="w-[240px]">
                        <SelectValue placeholder="Select a department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Departments</SelectLabel>
                          {departments?.body?.map((department) => (
                            <SelectItem
                              key={department.id}
                              value={String(department.id)}
                            >
                              {department.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.departmentId?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </main>
    );
  }
);

EmployeeForm.displayName = "EmployeeForm";
