// Name: Zay Yar Tun
// Admin No: 2235035
// Class: DIT/FT/2B/02

"use client";

import { useAppState } from "@/app/app-provider";
import Header from "@/components/custom/header";
import Footer from "@/components/custom/footer";

// this is the user view with header and footer
// don't change this unless necessary
export default function PublicContent({ children }: { children: React.ReactNode }) {
  // isLoading is used to check whether the token is retrieved
  const { headerCanLoad } = useAppState();

  return (
    headerCanLoad && (
      <>
        <Header></Header>
        <main>{children}</main>
        <Footer></Footer>
      </>
    )
  );
}
