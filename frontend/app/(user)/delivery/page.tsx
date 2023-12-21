"use client";

import { useAppState } from "@/app/app-provider";
import { useEffect } from "react";
import { CurrentActivePage } from "@/app/_enums/global-enums";
import { useRouter } from "next/navigation";

export default function Cart() {
  const { token, setToken, setCurrentActivePage } = useAppState();
  const router = useRouter();

  useEffect(() => {
    setCurrentActivePage(CurrentActivePage.AllDelivery);
    if (!token) {
      alert("Unauthorized Access!");
      localStorage.removeItem("token");
      setToken(null);
      router.replace("/signin");
    }
  }, []);

  if (!token) return <></>;

  return (
    <div>
      <label>This is delivery page!</label>
    </div>
  );
}
