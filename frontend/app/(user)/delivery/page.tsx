"use client";

import { useAppState } from "@/app/app-provider";
import { useEffect } from "react";
import { CurrentActivePage } from "@/app/_enums/global-enums";

export default function Cart() {
  const { token, setCurrentActivePage } = useAppState();

  useEffect(() => {
    setCurrentActivePage(CurrentActivePage.None);
  }, []);

  return (
    <div>
      <label>This is delivery page!</label>
    </div>
  );
}
