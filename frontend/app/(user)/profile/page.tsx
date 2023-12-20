"use client";

import { CurrentActivePage } from "@/app/_enums/global-enums";
import { useAppState } from "@/app/app-provider";
import { useEffect } from "react";
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
    setCurrentActivePage(CurrentActivePage.Profile);
  }, []);

  return (
    <div>
      <label>This is profile page!</label>
    </div>
  );
}
