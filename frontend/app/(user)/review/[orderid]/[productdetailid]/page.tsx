"use client";

import { CurrentActivePage } from "@/app/_enums/global-enums";
import { useAppState } from "@/app/app-provider";
import { useEffect } from "react";

export default function ReviewForm({ params }: { params: { orderid: number; productdetailid: number } }) {
  const { setCurrentActivePage } = useAppState();
  const { orderid, productdetailid } = params;

  console.log(orderid);
  console.log(productdetailid);

  useEffect(() => {
    setCurrentActivePage(CurrentActivePage.None);
  }, []);

  return <div>This is review form page!</div>;
}
