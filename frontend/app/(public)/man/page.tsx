"use client";

import { useAppState } from "@/app/app-provider";
import { useEffect } from "react";

export default function ManProduct() {
  const { setCurrentActivePage } = useAppState();

  useEffect(() => {
    setCurrentActivePage("man");
  }, []);

  return <div>This is man product page!</div>;
}
