"use client";

import { useAppState } from "@/app/app-provider";
import { useEffect } from "react";

export default function KidProduct() {
  const { setCurrentActivePage } = useAppState();

  useEffect(() => {
    setCurrentActivePage("kid");
  }, []);

  return <div>This is kid product page!</div>;
}
