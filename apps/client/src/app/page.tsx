import { ListEmployee } from "@/components/employee/list";
import { Suspense } from "react";

export default async function Page() {
  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <ListEmployee title="All People" />
      </Suspense>
    </main>
  );
}
