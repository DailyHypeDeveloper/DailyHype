"use client";

import { useAppState } from "@/app/app-provider";
import { useEffect } from "react";

export default function Product() {
  const { token, setCurrentPage } = useAppState();

  useEffect(() => {
    setCurrentPage("product");
  }, []);

  return <div>This is product page!</div>;
}
