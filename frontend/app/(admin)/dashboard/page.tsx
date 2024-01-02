"use client";

import { CurrentActivePage, URL } from "@/enums/global-enums";
import { useAppState } from "@/app/app-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { setCurrentActivePage } = useAppState();
  const router = useRouter();

  useEffect(() => {
    setCurrentActivePage(CurrentActivePage.Dashboard);
  }, []);

  return <div>This is admin dashboard page!</div>;
}
