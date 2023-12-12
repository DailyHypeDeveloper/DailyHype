"use client";

import { useAppState } from "../app-provider";

export default function Home() {
  const { token, setCurrentPage } = useAppState();

  setCurrentPage("home");

  return (
    <div>
      <label>This is home page!</label>
    </div>
  );
}
