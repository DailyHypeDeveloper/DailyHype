"use client";

import { useAppState } from "@/app/app-provider";
import { useEffect } from "react";

export default function Cart() {
  const { token, setCurrentPage } = useAppState();

  useEffect(() => {
    setCurrentPage("delivery");
  }, []);

  return (
    <div>
      <label>This is delivery page!</label>
    </div>
  );
}
