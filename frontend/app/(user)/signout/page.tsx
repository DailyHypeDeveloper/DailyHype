"use client";

import { useEffect } from "react";
import { useAppState } from "@/app/app-provider";
import { useRouter } from "next/navigation";

export default function Page() {
  const { setToken } = useAppState();

  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem("token");
    setToken("");
    router.replace("/");
  }, []);
  return null;
}
