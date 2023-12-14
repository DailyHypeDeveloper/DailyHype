"use client";

import { useAppState } from "@/app/app-provider";
import { useEffect } from "react";

export default function Cart() {
  const { token } = useAppState();

  return (
    <div>
      <label>This is profile page!</label>
    </div>
  );
}
