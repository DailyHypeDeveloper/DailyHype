// Name: Zay Yar Tun
// Admin No: 2235035
// Class: DIT/FT/2B/02

"use client";

import { useAppState } from "@/app/app-provider";
import dynamic from "next/dynamic";
import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/react";
import { capitaliseWord } from "@/functions/formatter";
import { ErrorMessage, URL } from "@/enums/global-enums";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Header = dynamic(() => import("@/components/custom/header"));
const Footer = dynamic(() => import("@/components/custom/footer"));
const UserSideBar = dynamic(() => import("@/components/custom/user-sidebar"));

// this is the user view with header and footer
// don't change this unless necessary
export default function UserContent({ children }: { children: React.ReactNode }) {
  // isLoading is used to check whether the token is retrieved
  const { headerCanLoad, redirectPage, userInfo, isAuthenticated, currentActivePage } = useAppState();
  const router = useRouter();

  useEffect(() => {
    let authCheckFinish = false;
    if (redirectPage === URL.SignOut && headerCanLoad) {
      alert("Invalid Token");
      authCheckFinish = true;
      router.push(URL.SignOut);
    }
    if (!authCheckFinish && !isAuthenticated && headerCanLoad) {
      alert(ErrorMessage.Unauthorized);
      authCheckFinish = true;
      router.push(URL.SignOut);
    }
    if (!authCheckFinish && userInfo.role !== "customer" && headerCanLoad) {
      alert(ErrorMessage.Unauthorized);
      router.push(URL.SignOut);
    }
  }, [redirectPage, headerCanLoad, isAuthenticated]);

  return (
    <>
      {isAuthenticated && headerCanLoad && (
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
