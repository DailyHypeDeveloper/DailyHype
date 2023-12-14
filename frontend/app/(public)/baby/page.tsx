"use client";

import { useAppState } from "@/app/app-provider";
import { useEffect } from "react";

export default function BabyProduct() {
  const { setCurrentActivePage } = useAppState();

  useEffect(() => {
    setCurrentActivePage("baby");
  }, []);

  return <div>This is baby product page!</div>;
}
