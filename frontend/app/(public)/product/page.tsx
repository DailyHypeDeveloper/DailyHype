"use client";

import { useAppState } from "@/app/app-provider";

export default function Product() {
  const { token, setCurrentPage } = useAppState();
  setCurrentPage("product");

  return <div>This is product page!</div>;
}
