"use client";

import { NextUIProvider } from "@nextui-org/react";

// this is the ui provider for next ui
// don't change this provider unless necessary
export default function UIProvider({ children }: { children: React.ReactNode }) {
  return <NextUIProvider>{children}</NextUIProvider>;
}
