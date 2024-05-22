"use client";

import { apiClientQuery } from "ts-contract";

export function ClientComponent() {
  const {
    isLoading,
    isError,
    data: dataReactQUery,
  } = apiClientQuery.employees.getAll.useQuery(["users"]);

  if (isError) return <div>Error</div>;

  return (
    <div className="flex flex-col gap-3 p-5">
      <div className="font-bold">React Query Render</div>
      <div className="bg-slate-600 text-slate-300 p-5 rounded ">
        {isLoading && <div>Loading...</div>}
        {JSON.stringify(dataReactQUery?.body, null, 2)}
      </div>
    </div>
  );
}
