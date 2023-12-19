"use client";

import { CurrentActivePage } from "@/app/_enums/global-enums";
import { useAppState } from "@/app/app-provider";
import { useEffect } from "react";

export default function Cart() {
  const { token, setCurrentActivePage } = useAppState();

  useEffect(() => {
    setCurrentActivePage(CurrentActivePage.None);
  }, []);

  return (
    <div>
      <label>This is profile page!</label>
    </div>
  );
}
