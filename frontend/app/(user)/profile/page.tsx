"use client";

import { useAppState } from "@/app/app-provider";

export default function Cart() {
  const { token, setCurrentPage } = useAppState();

  setCurrentPage("profile");

  return (
    <div>
      <label>This is profile page!</label>
    </div>
  );
}
