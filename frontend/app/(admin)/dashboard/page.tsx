"use client";

import { CurrentActivePage, URL } from "@/app/_enums/global-enums";
import { useAppState } from "@/app/app-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Product() {
  const { token, setToken, setCurrentActivePage } = useAppState();
  const router = useRouter();

  useEffect(() => {
    setCurrentActivePage(CurrentActivePage.Dashboard);
    if (!token) {
      alert("Unauthorized Access!");
      localStorage.removeItem("token");
      setToken(null);
      router.replace(URL.SignIn);
    }
  }, []);

  if (!token) return <></>;

  return <div>This is admin dashboard page!</div>;
}
