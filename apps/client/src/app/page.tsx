import { Employee, apiClient } from "ts-contract";
import { ListEmployee } from "@/components/employee/list";
import { ErrorStatus } from "@/components/error-ui";

export default async function Page() {
  const { body, status } = await apiClient.employees.getAll();
  if (status !== 200) {
    return <ErrorStatus />;
  }
  return (
    <main>
      <ListEmployee employees={body as Employee[]} title="All People" />
    </main>
  );
}
