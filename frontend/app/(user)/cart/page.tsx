"use client";

import { useAppState } from "@/app/app-provider";

export default function Cart() {
  const { token, setCurrentPage } = useAppState();

  setCurrentPage("cart");

  return (
    <div>
      <label>This is cart page!</label>
    </div>
  );
}
