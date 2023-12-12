"use client";

import { useAppState } from "@/app/app-provider";

export default function Product() {
  const { token, setCurrentPage } = useAppState();

  return <div>This is admin dashboard page!</div>;
}
