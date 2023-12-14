"use client";

import { useAppState } from "@/app/app-provider";
import { useEffect } from "react";

export default function Cart() {
  const { token, cart, setCart } = useAppState();

  return (
    <div>
      <label>This is cart page!</label>
    </div>
  );
}
