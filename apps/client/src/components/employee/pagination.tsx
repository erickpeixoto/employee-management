"use client";

import { Pagination as PaginationUI } from "@nextui-org/react";

interface PaginationProps {
  total: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ total, currentPage, onPageChange }: PaginationProps) {
  return (
    <PaginationUI
      onChange={onPageChange}
      total={total}
      initialPage={1}
      page={currentPage}
      dotsJump={total}
      className="mt-5"
    />
  );
}
