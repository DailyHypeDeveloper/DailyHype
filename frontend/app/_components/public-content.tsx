"use client";

import { useAppState } from "../app-provider";
import Header from "./header";
import Footer from "./footer";

// this is the user view with header and footer
// don't change this unless necessary
export default function PublicContent({ children }: { children: React.ReactNode }) {
  // isLoading is used to check whether the token is retrieved
  const { isLoading } = useAppState();

  return (
    !isLoading && (
      <>
        <Header></Header>
        <main>{children}</main>
        <Footer></Footer>
      </>
    )
  );
}
