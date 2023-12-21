// Name: Zay Yar Tun
// Admin No: 2235035
// Class: DIT/FT/2B/02

"use client";

import { CurrentActivePage } from "@/app/_enums/global-enums";
import { useAppState } from "@/app/app-provider";
import { useEffect } from "react";

export default function Cart() {
  const { cart, setCart, setCurrentActivePage } = useAppState();

  useEffect(() => {
    setCurrentActivePage(CurrentActivePage.None);
  }, []);

  return (
    <>
      <div>
        <label>This is cart page!</label>
      </div>
    </>
  );
}
