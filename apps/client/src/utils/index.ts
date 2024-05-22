import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function dateDiffInDetail(date1: Date, date2: Date) {
  let years = date2.getFullYear() - date1.getFullYear();
  let months = date2.getMonth() - date1.getMonth();
  let days = date2.getDate() - date1.getDate();

  if (days < 0) {
    months -= 1;
    days += new Date(date2.getFullYear(), date2.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  
  return { years, months, days };
}

export function formatHireDate(hireDate: string | number | Date) {
  const hireDateObj = new Date(hireDate);
  const currentDate = new Date();
  const diff = dateDiffInDetail(hireDateObj, currentDate);

  const formattedHireDate = hireDateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  let diffString = `${diff.years}y`;
  if (diff.months > 0) {
    diffString += ` – ${diff.months}m`;
  }
  diffString += ` – ${diff.days}d`;

  return `${formattedHireDate} (${diffString})`;
}