"use client";

import { Image, Link, Button, Input, Avatar, Badge, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useAppState } from "@/app/app-provider";
import { useTheme } from "next-themes";
import { ErrorMessage, URL } from "@/enums/global-enums";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useEffect } from "react";

// header component for user
export default function Header() {
  const { isAuthenticated, headerCanLoad, userInfo, redirectPage, currentActivePage, cart } = useAppState();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    let authCheckFinish = false;
    if (redirectPage == URL.SignOut) {
      alert("Invalid Token");
      authCheckFinish = true;
      router.push(URL.SignOut);
    }
    if (!authCheckFinish && userInfo.role !== "customer" && headerCanLoad) {
      if (isAuthenticated) {
        alert(ErrorMessage.Unauthorized);
        router.push(URL.SignOut);
      }
    }
  }, [redirectPage]);

  return (
    <header className="flex items-center h-[75px] px-12 justify-start dark:bg-slate-900 bg-slate-50 border-b-2 border-slate-300">
      <Link href={URL.Home} className="flex dark:text-slate-200 uppercase font-semibold text-slate-900 tracking-wider ml-2 text-2xl">
        dailyhype
      </Link>
      <div className="flex flex-1 justify-between items-center ms-4">
        <nav className="flex justify-start">
          <Link href={URL.Home} className={`${currentActivePage === "home" ? "text-black font-medium dark:text-white" : "text-slate-500 dark:text-slate-300"} ms-8 cursor-pointer hover:font-medium hover:text-black`}>
            <span>Home</span>
          </Link>
          <Link href={URL.Man} className={`${currentActivePage === "man" ? "text-black font-medium dark:text-white" : "text-slate-500 dark:text-slate-300"} ms-8 cursor-pointer hover:font-medium hover:text-black`}>
            Man
          </Link>
          <Link href={URL.Woman} className={`${currentActivePage === "woman" ? "text-black font-medium dark:text-white" : "text-slate-500 dark:text-slate-300"} ms-8 cursor-pointer hover:font-medium hover:text-black`}>
            Woman
          </Link>
          <Link href={URL.Kid} className={`${currentActivePage === "kid" ? "text-black font-medium dark:text-white" : "text-slate-500 dark:text-slate-300"} ms-8 cursor-pointer hover:font-medium hover:text-black`}>
            Kid
          </Link>
          <Link href={URL.Baby} className={`${currentActivePage === "baby" ? "text-black font-medium dark:text-white" : "text-slate-500 dark:text-slate-300"} ms-8 cursor-pointer hover:font-medium hover:text-black`}>
            Baby
          </Link>
        </nav>
        <nav className="flex flex-1 justify-end items-center select-none">
          <Input type="text" placeholder="Search Product" className="max-w-[300px] me-6" size="sm" variant="bordered" radius="sm" startContent={theme === "dark" ? <Image width={20} src="/icons/search-dark.svg" className="flex items-center justify-center" alt="Search Icon" /> : <Image width={20} src="/icons/search.svg" className="flex items-center justify-center" alt="Search Icon" />} />
          <Badge content={cart ? cart.length : 0} className="bg-custom-color2 text-white" size="md">
            <Link href={URL.Cart} className="px-2 py-1 hover:dark:bg-slate-700 hover:bg-slate-200 rounded-md cursor-pointer" title="Shopping Bag">
              {theme === "dark" ? <Image src="/icons/shopping-bag-dark.svg" radius="none" width={25} alt="Shopping Cart Icon" /> : <Image src="/icons/shopping-bag.svg" radius="none" width={25} alt="Shopping Cart Icon" />}
            </Link>
          </Badge>
          {theme === "dark" ? <MoonIcon className="cursor-pointer ms-8 w-[20px] h-[20px]" onClick={() => setTheme("light")} /> : <SunIcon className="cursor-pointer ms-8 w-[20px] h-[20px]" onClick={() => setTheme("dark")} />}
          {isAuthenticated && headerCanLoad && (
            <Dropdown placement="bottom-end" className="select-none">
              <DropdownTrigger>
                <Avatar as="button" className="transition-transform ms-8 border-2 select-none border-gray-400" src={userInfo.image ? userInfo.image : theme === "light" ? "/icons/user.svg" : "/icons/user-dark.svg"} />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem aria-label="User Information" href={URL.Personal} key="info" className="h-14 gap-2">
                  <p className="font-medium">Signed in as</p>
                  <p className="font-medium">{userInfo.email}</p>
                </DropdownItem>
                <DropdownItem aria-label="Profile" href={URL.Profile} key="profile">
                  Profile
                </DropdownItem>
                <DropdownItem aria-label="Order" href={URL.AllOrder} key="order">
                  Order
                </DropdownItem>
                <DropdownItem aria-label="Delivery" href={URL.Delivery} key="delivery">
                  Delivery
                </DropdownItem>
                <DropdownItem
                  aria-label="Sign Out"
                  onClick={() => {
                    router.push(URL.SignOut);
                  }}
                  key="logout"
                  color="danger"
                >
                  Sign Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}
          {!isAuthenticated && headerCanLoad && (
            <>
              <Button
                onClick={() => {
                  router.push(URL.SignIn);
                }}
                variant="ghost"
                className="ms-6"
              >
                Sign In
              </Button>
              <Button
                onClick={() => {
                  router.push(URL.SignUp);
                }}
                className="ms-4 text-white bg-gradient-to-r from-custom-color1 to-custom-color2"
              >
                Register
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
