"use client";

import { useEffect } from "react";
import { useAppState } from "../app-provider";

export default function Home() {
  const { token, setCurrentActivePage } = useAppState();

  useEffect(() => {
    setCurrentActivePage("home");
  }, []);

  return (
    <div>
      <label>This is home page!</label>
    </div>
  );
}
