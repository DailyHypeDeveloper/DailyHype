"use client";

import { CurrentActivePage } from "@/app/_enums/global-enums";
import { useAppState } from "@/app/app-provider";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Cart() {
  const { token, setToken, setCurrentActivePage } = useAppState();
  const router = useRouter();

  useEffect(() => {
    setCurrentActivePage(CurrentActivePage.Profile);
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
      <label>This is profile page!</label>
    </div>
  );
}
