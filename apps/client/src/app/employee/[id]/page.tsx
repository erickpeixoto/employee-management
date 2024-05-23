interface EmployeeDetailsProps {
  params: {
    id: string;
  };
}

export function EmployeeDetails({ params: { id } }: EmployeeDetailsProps) {
  return (
    <div>
      <h1 className="text-3xl font-bold">Employee Details { id }</h1>
    </div>
  );
}
