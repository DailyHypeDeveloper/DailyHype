"use client";

import { useAppState } from "@/app/app-provider";
import { useEffect } from "react";

export default function About() {
  const { setCurrentActivePage } = useAppState();

  useEffect(() => {
    setCurrentActivePage("none");
  }, []);

  return <div>This is about page!</div>;
}
