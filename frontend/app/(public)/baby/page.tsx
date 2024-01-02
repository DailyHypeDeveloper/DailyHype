"use client";

import { CurrentActivePage } from "@/enums/global-enums";
import { useAppState } from "@/app/app-provider";
import { useEffect } from "react";

export default function BabyProduct() {
  const { setCurrentActivePage } = useAppState();

  useEffect(() => {
    setCurrentActivePage(CurrentActivePage.Baby);
  }, []);

  return <div>This is baby product page!</div>;
}
