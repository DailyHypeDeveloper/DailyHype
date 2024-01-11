"use client";

import { useAppState } from "@/app/app-provider";
import { useEffect } from "react";
import { CurrentActivePage, URL } from "@/enums/global-enums";
import { useRouter } from "next/navigation";

export default function Page() {
  const { setCurrentActivePage } = useAppState();
  const router = useRouter();

  useEffect(() => {
    setCurrentActivePage(CurrentActivePage.AllDelivery);
  }, []);

  return (
    <div>
      <label>This is delivery page!</label>
    </div>
  );
}
