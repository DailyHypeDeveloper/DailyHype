"use client";

import { useEffect } from "react";
import { useAppState } from "../app-provider";

export default function Home() {
  const { token, setCurrentPage } = useAppState();

  useEffect(() => {
    setCurrentPage("home");
  }, []);

  return (
    <div>
      <label>This is home page!</label>
    </div>
  );
}
