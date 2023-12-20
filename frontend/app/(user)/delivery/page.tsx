"use client";

import { useAppState } from "@/app/app-provider";
import { useEffect } from "react";
import { CurrentActivePage } from "@/app/_enums/global-enums";
import { useRouter } from "next/navigation";

export default function Cart() {
  const { token, setCurrentActivePage } = useAppState();
  const router = useRouter();

  if (!token) {
    alert("Unauthorized Access!");
    router.replace("/signout");
    return null;
  }

  useEffect(() => {
    setCurrentActivePage(CurrentActivePage.AllDelivery);
  }, []);

  return (
    <div>
      <label>This is delivery page!</label>
    </div>
  );
}
