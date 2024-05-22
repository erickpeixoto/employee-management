import { ClientComponent } from "@/components/client-component";
import { apiClientQuery } from "ts-contract";
import { getQueryClient } from "@/utils/react-query/get-query-client";
import {Button} from "@nextui-org/button";

export default async function Page() {
  const client = getQueryClient();
  await apiClientQuery.employees.getAll.prefetchQuery(client, ["users"]);

  return (
    <main>
        <ClientComponent />
    </main>
  );
}
