"use client";

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import * as LR from "@uploadcare/blocks";
import "@uploadcare/blocks/web/lr-file-uploader-regular.min.css";

LR.registerBlocks(LR);

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
import { Avatar } from "@nextui-org/avatar";

interface EmployeeFormProps {
  onClose: () => void;
}

export const EmployeeForm = forwardRef(
  ({ onClose }: EmployeeFormProps, ref) => {
    const form = useForm<Employee>({
      resolver: zodResolver(
        employeeSchema
      ),
      defaultValues: {
        firstName: "",
        lastName: "",
        phone: "",
        address: "",
        hireDate: new Date()
      },
    });
    const [file, setFile] = useState<string>("");
    const ctxProviderRef = useRef(null);

    useEffect(() => {
      setFile("");
      form.setValue("avatar", "");
      
      const ctxProvider = ctxProviderRef.current as HTMLElement | null;
      if (!ctxProvider) return;

      const handleChangeEvent = (event: any) => {
        setFile(event.detail.allEntries[0]?.cdnUrl ?? "");
        form.setValue("avatar", event.detail.allEntries[0]?.cdnUrl ?? "");
      };

      ctxProvider?.addEventListener("change", handleChangeEvent);

      return () => {
        ctxProvider?.removeEventListener("change", handleChangeEvent);
      };
    }, [setFile, form]);

    const { data: departments, isLoading: loadingDepartments } =
      apiClientQuery.departments.getAll.useQuery(["deparments"]);

    const { mutate, isLoading } = apiClientQuery.employees.create.useMutation({
      onSuccess: () => {
        const ctxProvider = ctxProviderRef.current as HTMLElement | null;
        ctxProvider?.remove();
        form.reset();
        onClose();
        setFile("");
        
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
            <div className="flex justify-between">
              <div className="flex flex-col gap-y-2 md:h-200px justify-center">
                <h3 className="text-base">Avatar</h3>
                <div>
                  <lr-config
                    ctx-name="my-uploader"
                    pubkey="1b52e5f8b8b8aa8a920d"
                    maxLocalFileSizeBytes={10000000}
                    multiple={false}
                    imgOnly={true}
                    sourceList="local, url, camera"
                  ></lr-config>
                  <lr-file-uploader-regular
                    ctx-name="my-uploader"
                    class="my-config"
                  ></lr-file-uploader-regular>
                  <lr-upload-ctx-provider
                    ctx-name="my-uploader"
                    ref={ctxProviderRef}
                  />
                </div>
              </div>
              {file && (
                <div className="mt-4">
                  <Avatar
                    src={file}
                    size="lg"
                    className="md:w-[160px] md:h-[160px] text-large"
                  />
                </div>
              )}
            </div>

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
