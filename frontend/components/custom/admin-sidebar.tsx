"use client";

import { Image } from "@nextui-org/react";
import { useAppState } from "@/app/app-provider";
import { useRouter } from "next/navigation";
import { CurrentActivePage, ErrorMessage, URL } from "@/enums/global-enums";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import SideBarDropDown from "@/components/custom/admin-sidebar-dropdown";
import SideBarItem from "@/components/custom/admin-sidebar-item";

interface DropDownOpen {
  dropDownKey: number;
  itemKey?: number;
}

export default function SideBar({ children }: { children: React.ReactNode }) {
  const { headerCanLoad, currentActivePage, userInfo, isAuthenticated, redirectPage } = useAppState();
  const [dropDownOpen, setDropDownOpen] = useState<DropDownOpen[]>([]);
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (headerCanLoad) setTheme("light");
  }, []);

  useEffect(() => {
    let authCheckFinish = false;
    if (redirectPage == URL.SignOut && headerCanLoad) {
      alert("Invalid Token");
      authCheckFinish = true;
      router.push(URL.SignOut);
    }
    if (!authCheckFinish && !isAuthenticated && headerCanLoad) {
      alert(ErrorMessage.Unauthorized);
      authCheckFinish = true;
      router.push(URL.SignOut);
    }
    if (!authCheckFinish && userInfo.role !== "admin" && headerCanLoad) {
      alert(ErrorMessage.Unauthorized);
      router.push(URL.SignOut);
    }
  }, [redirectPage, headerCanLoad, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && headerCanLoad)
      if (currentActivePage === CurrentActivePage.Dashboard) {
        setDropDownOpen([]);
      } else if (currentActivePage === CurrentActivePage.UserForm) {
        setDropDownOpen([{ dropDownKey: 1, itemKey: 1 }]);
      } else if (currentActivePage === CurrentActivePage.OrderList) {
        setDropDownOpen([{ dropDownKey: 2, itemKey: 5 }]);
      }
  }, [currentActivePage]);

  return (
    <>
      {isAuthenticated && headerCanLoad && theme === "light" && (
        <div className="flex max-w-full select-none">
          <div className="flex flex-col py-4 w-[300px] bg-slate-100 dark:bg-slate-900 items-start max-h-screen h-screen fixed top-0 left-0 overflow-hidden">
            <div className="px-4 mt-2 mb-4 flex items-center justify-between w-full">
              <label className="text-2xl font-semibold uppercase">DAILYHYPE</label>
            </div>
            <div className="overflow-y-auto overflow-x-hidden w-full max-h-[85%]">
              <SideBarItem label="Dashboard" route={URL.Dashboard} iconPath="/icons/home-slate.svg" activeIconPath="/icons/home-logo-color.svg" isSelected={currentActivePage === CurrentActivePage.Dashboard} />
              <SideBarDropDown dropDownKey={1} setDropDownOpen={setDropDownOpen} dropDownOpen={dropDownOpen} isSelected={false} activeIconPath="/icons/file-logo-color.svg" iconPath="/icons/file-slate.svg" label="Forms" />
              <SideBarItem itemKey={1} dropDownOpen={dropDownOpen} dropDownKey={1} type="dropdownitem" label="User" route={URL.UserForm} iconPath="/icons/corner-down-right-slate.svg" activeIconPath="/icons/corner-down-right-logo-color.svg" />
              <SideBarItem itemKey={2} dropDownOpen={dropDownOpen} dropDownKey={1} type="dropdownitem" label="Product" route={URL.UserForm} iconPath="/icons/corner-down-right-slate.svg" activeIconPath="/icons/corner-down-right-logo-color.svg" />
              <SideBarItem itemKey={3} dropDownOpen={dropDownOpen} dropDownKey={1} type="dropdownitem" label="Colour" route={URL.UserForm} iconPath="/icons/corner-down-right-slate.svg" activeIconPath="/icons/corner-down-right-logo-color.svg" />
              <SideBarItem itemKey={4} dropDownOpen={dropDownOpen} dropDownKey={1} type="dropdownitem" label="Category" route={URL.UserForm} iconPath="/icons/corner-down-right-slate.svg" activeIconPath="/icons/corner-down-right-logo-color.svg" />
              <SideBarItem itemKey={5} dropDownOpen={dropDownOpen} dropDownKey={1} type="dropdownitem" label="Delivery" route={URL.UserForm} iconPath="/icons/corner-down-right-slate.svg" activeIconPath="/icons/corner-down-right-logo-color.svg" />

              <SideBarDropDown dropDownKey={2} setDropDownOpen={setDropDownOpen} dropDownOpen={dropDownOpen} isSelected={false} activeIconPath="/icons/list-logo-color.svg" iconPath="/icons/list-slate.svg" label="Lists" />
              <SideBarItem itemKey={1} dropDownOpen={dropDownOpen} dropDownKey={2} type="dropdownitem" label="User" route={URL.UserForm} iconPath="/icons/corner-down-right-slate.svg" activeIconPath="/icons/corner-down-right-logo-color.svg" />
              <SideBarItem itemKey={2} dropDownOpen={dropDownOpen} dropDownKey={2} type="dropdownitem" label="Product" route={URL.UserForm} iconPath="/icons/corner-down-right-slate.svg" activeIconPath="/icons/corner-down-right-logo-color.svg" />
              <SideBarItem itemKey={3} dropDownOpen={dropDownOpen} dropDownKey={2} type="dropdownitem" label="Colour" route={URL.UserForm} iconPath="/icons/corner-down-right-slate.svg" activeIconPath="/icons/corner-down-right-logo-color.svg" />
              <SideBarItem itemKey={4} dropDownOpen={dropDownOpen} dropDownKey={2} type="dropdownitem" label="Category" route={URL.UserForm} iconPath="/icons/corner-down-right-slate.svg" activeIconPath="/icons/corner-down-right-logo-color.svg" />
              <SideBarItem itemKey={5} dropDownOpen={dropDownOpen} dropDownKey={2} type="dropdownitem" label="Order" route={URL.OrderList} iconPath="/icons/corner-down-right-slate.svg" activeIconPath="/icons/corner-down-right-logo-color.svg" />
              <SideBarItem itemKey={6} dropDownOpen={dropDownOpen} dropDownKey={2} type="dropdownitem" label="Delivery" route={URL.UserForm} iconPath="/icons/corner-down-right-slate.svg" activeIconPath="/icons/corner-down-right-logo-color.svg" />
              <SideBarItem itemKey={7} dropDownOpen={dropDownOpen} dropDownKey={2} type="dropdownitem" label="Review" route={URL.UserForm} iconPath="/icons/corner-down-right-slate.svg" activeIconPath="/icons/corner-down-right-logo-color.svg" />

              <SideBarDropDown dropDownKey={3} setDropDownOpen={setDropDownOpen} dropDownOpen={dropDownOpen} isSelected={false} activeIconPath="/icons/pie-chart-logo-color.svg" iconPath="/icons/pie-chart-slate.svg" label="Statistics" />
              <SideBarItem itemKey={1} dropDownOpen={dropDownOpen} dropDownKey={3} type="dropdownitem" label="User" route={URL.UserForm} iconPath="/icons/corner-down-right-slate.svg" activeIconPath="/icons/corner-down-right-logo-color.svg" />
              <SideBarItem itemKey={2} dropDownOpen={dropDownOpen} dropDownKey={3} type="dropdownitem" label="Product" route={URL.UserForm} iconPath="/icons/corner-down-right-slate.svg" activeIconPath="/icons/corner-down-right-logo-color.svg" />
              <SideBarItem itemKey={3} dropDownOpen={dropDownOpen} dropDownKey={3} type="dropdownitem" label="Order" route={URL.OrderList} iconPath="/icons/corner-down-right-slate.svg" activeIconPath="/icons/corner-down-right-logo-color.svg" />
              <SideBarItem itemKey={4} dropDownOpen={dropDownOpen} dropDownKey={3} type="dropdownitem" label="Delivery" route={URL.UserForm} iconPath="/icons/corner-down-right-slate.svg" activeIconPath="/icons/corner-down-right-logo-color.svg" />
              <SideBarItem itemKey={5} dropDownOpen={dropDownOpen} dropDownKey={3} type="dropdownitem" label="Review" route={URL.UserForm} iconPath="/icons/corner-down-right-slate.svg" activeIconPath="/icons/corner-down-right-logo-color.svg" />
            </div>

            <div className="fixed bottom-0 pb-3 left-0 w-[300px] z-10 bg-slate-100">
              <div
                onClick={() => {
                  router.push(URL.SignOut);
                }}
                className="mx-4 mt-auto items-center hover:bg-logo-color-lighter cursor-pointer w-[88%]  px-4 rounded-lg py-3 flex"
              >
                <Image radius="none" className="cursor-pointer mr-2 w-6 h-6" src="/icons/log-out-slate.svg" />
                <label className="cursor-pointer text-medium text-slate-600">Sign Out</label>
              </div>
            </div>
          </div>
          <main className="flex max-w-full ms-[300px]">{children}</main>
        </div>
      )}
    </>
  );
}
