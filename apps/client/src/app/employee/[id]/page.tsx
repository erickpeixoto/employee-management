import { unstable_noStore as noStore } from "next/cache";
import { Drawer } from "@/components/ui/drawer";
import { apiClientQuery } from "ts-contract";
import { Details } from "@/components/employee/details";
import { GripHorizontal } from "lucide-react";
import { dehydrate } from "@tanstack/query-core";
import { getQueryClient } from "@/utils/react-query/get-query-client";
import { Hydrate } from "@/utils/react-query/hydrate.client";
import { Suspense } from "react";

interface EmployeeDetailsProps {
  params: {
    id: string;
  };
}

export default async function EmployeeDetails({
  params: { id },
}: EmployeeDetailsProps) {
  noStore();
  const client = getQueryClient();

  apiClientQuery.employees.getOne.prefetchQuery(client, ["employees", id], {
    query: { id },
  });
  apiClientQuery.employees.getDepartmentHistory.prefetchQuery(
    client,
    ["employees-history", id],
    {
      query: {
        page: "1",
        limit: "10",
        employeeId: id,
      },
    }
  );
  await apiClientQuery.departments.getAll.prefetchQuery(client, [
    "departments",
  ]);
  const dehydratedState = dehydrate(client);

  return (
    <Hydrate state={dehydratedState}>
      <Drawer>
        <div className="flex flex-col md:p-5 items-center w-full">
          <div className="flex items-center gap-4">
            <GripHorizontal size={32} className="cursor-s-resize" />
            <h1 className="text-2xl font-semibold">Employee Details</h1>
          </div>
          <Suspense fallback={<div>Loading...</div>}>
            <Details id={id} />
          </Suspense>
        </div>
      </Drawer>
    </Hydrate>
  );
}
