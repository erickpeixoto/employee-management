"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
} from "@nextui-org/react";
import { Employee } from "ts-contract";

interface HistoryListProps {
  departmentHistories: Employee["departmentHistories"];
  isLoading?: boolean;
}

export function HistoryList({
  departmentHistories = [],
  isLoading,
}: HistoryListProps) {
  return (
    <Table aria-label="Department History" className="mt-4">
      <TableHeader>
        <TableColumn>DATE</TableColumn>
        <TableColumn>OLD DEPARTMENT</TableColumn>
        <TableColumn>NEW DEPARTMENT</TableColumn>
      </TableHeader>
      <TableBody
        isLoading={isLoading}
        loadingContent={<Spinner label="Loading..." />}
        emptyContent={"No rows to display."}
      >
        {departmentHistories.map((history) => (
          <TableRow key={history.id}>
            <TableCell>
              {new Date(history.changeDate).toLocaleDateString()}
            </TableCell>
            <TableCell>{history.oldDepartment?.name}</TableCell>
            <TableCell>{history.newDepartment?.name}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
