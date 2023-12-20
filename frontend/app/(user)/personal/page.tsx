"use client";

import { CurrentActivePage } from "@/app/_enums/global-enums";
import { useAppState } from "@/app/app-provider";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PersonalPage() {
  const { token, setCurrentActivePage } = useAppState();
  const router = useRouter();

  if(!token) {
    alert("Unauthorized Access!");
    router.replace("/signout");
    return null;
  }

  useEffect(() => {
    setCurrentActivePage(CurrentActivePage.PersonalCenter);
  }, []);

  return <div>This is personal page</div>;
}
