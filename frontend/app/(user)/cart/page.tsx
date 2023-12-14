"use client";

import { useAppState } from "@/app/app-provider";
import { useEffect } from "react";

export default function Cart() {
  const { token, cart, setCart, setCurrentActivePage } = useAppState();

  useEffect(() => {
    setCurrentActivePage("none");
  }, []);

  return (
    <div>
      <label>This is cart page!</label>
    </div>
  );
}
