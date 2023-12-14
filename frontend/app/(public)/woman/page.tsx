"use client";

import { useAppState } from "@/app/app-provider";
import { useEffect } from "react";

export default function WomanProduct() {
  const { setCurrentActivePage } = useAppState();

  useEffect(() => {
    setCurrentActivePage("woman");
  }, []);

  return <div>This is woman product page!</div>;
}
