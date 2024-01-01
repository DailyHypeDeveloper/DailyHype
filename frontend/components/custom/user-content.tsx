// Name: Zay Yar Tun
// Admin No: 2235035
// Class: DIT/FT/2B/02

"use client";

import { useAppState } from "@/app/app-provider";
import Header from "@/components/custom/header";
import Footer from "@/components/custom/footer";
import UserSideBar from "@/components/custom/user-sidebar";
import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/react";
import { capitaliseWord } from "@/functions/formatter";
import { URL } from "@/enums/global-enums";

// this is the user view with header and footer
// don't change this unless necessary
export default function UserContent({ children }: { children: React.ReactNode }) {
  // isLoading is used to check whether the token is retrieved
  const { headerCanLoad, currentActivePage } = useAppState();

  return (
    <>
      {headerCanLoad && (
        <>
          <Header></Header>
          <Breadcrumbs className="mx-10 mt-10">
            <BreadcrumbItem href={URL.Home}>Home</BreadcrumbItem>
            <BreadcrumbItem>{capitaliseWord(currentActivePage)}</BreadcrumbItem>
          </Breadcrumbs>
          <div className="flex max-w-full mx-10 my-10">
            <UserSideBar />
            <main className="flex w-full max-w-full basis-4/5 mx-12">{children}</main>
          </div>
          <Footer></Footer>
        </>
      )}
    </>
  );
}
