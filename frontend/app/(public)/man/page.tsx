"use client";

import { CurrentActivePage } from "@/app/_enums/global-enums";
import { useAppState } from "@/app/app-provider";
import { useEffect } from "react";

export default function ManProduct() {
  const { setCurrentActivePage } = useAppState();

  useEffect(() => {
    setCurrentActivePage(CurrentActivePage.Man);
  }, []);

  return <div>This is man product page!</div>;
}
