import { unstable_noStore as noStore } from "next/cache";
import { Drawer } from "@/components/ui/drawer";
import { apiClientQuery } from "ts-contract";
import { Details } from "@/components/employee/details";
import { GripHorizontal } from "lucide-react";
import { dehydrate } from "@tanstack/query-core";
import { getQueryClient } from "@/utils/react-query/get-query-client";
import { Hydrate } from "@/utils/react-query/hydrate.client";

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

  await apiClientQuery.employees.getOne.prefetchQuery(
    client,
    ["employees", id],
    {
      query: { id },
    }
  );

  await apiClientQuery.departments.getAll.prefetchQuery(client, ["departments"]);
  const dehydratedState = dehydrate(client);

  return (
    <Hydrate state={dehydratedState}>
      <Drawer>
        <div className="flex flex-col md:p-5 items-center w-full">
          <div className="flex items-center gap-4">
            <GripHorizontal size={32} className="cursor-s-resize" />
            <h1 className="text-2xl font-semibold">Employee Details</h1>
          </div>
          <Details id={id} />
        </div>
      </Drawer>
    </Hydrate>
  );
}
