"use client";

import { useAppState } from "../app-provider";
import Header from "./header";

export default function UserContent({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAppState();

  return (
    !isLoading && (
      <>
        <Header></Header>
        <main>{children}</main>
        <footer></footer>
      </>
    )
  );
}
