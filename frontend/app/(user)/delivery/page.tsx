"use client";

import { useAppState } from "@/app/app-provider";

export default function Cart() {
  const { token, setCurrentPage } = useAppState();

  setCurrentPage("delivery");

  return (
    <div>
      <label>This is delivery page!</label>
    </div>
  );
}
