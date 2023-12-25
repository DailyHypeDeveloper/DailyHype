"use client";

import { CurrentActivePage, URL } from "@/app/_enums/global-enums";
import { useAppState } from "@/app/app-provider";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PersonalPage() {
  const { token, setToken, setCurrentActivePage } = useAppState();
  const router = useRouter();

  useEffect(() => {
    setCurrentActivePage(CurrentActivePage.PersonalCenter);
    if (!token) {
      alert("Unauthorized Access!");
      localStorage.removeItem("token");
      setToken(null);
      router.replace(URL.SignIn);
    }
  }, []);

  if (!token) return <></>;

  return <div>This is personal page</div>;
}
