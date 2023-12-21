"use client";

import { useAppState } from "@/app/app-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Product() {
  const { token, setToken, setCurrentActivePage } = useAppState();
  const router = useRouter();

  useEffect(() => {
    setCurrentActivePage("none");
    if (!token) {
      alert("Unauthorized Access!");
      localStorage.removeItem("token");
      setToken(null);
      router.replace("/signin");
    }
  }, []);

  if (!token) return <></>;

  return <div>This is admin dashboard page!</div>;
}
