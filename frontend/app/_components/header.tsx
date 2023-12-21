// Name: Zay Yar Tun
// Admin No: 2235035
// Class: DIT/FT/2B/02

"use client";

import React, { useEffect } from "react";
import { Image, Link, Button, Input, Avatar, Badge, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useAppState } from "../app-provider";
import { useTheme } from "next-themes";
import { validateToken } from "../_functions/common-functions";

// header component for user
export default function Header() {
  const { token, userInfo, currentActivePage, cart } = useAppState();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  // when the token is changed, this useEffect will run
  // this will validate the token
  useEffect(() => {
    if (token) {
      validateToken(token).then((result) => {
        if (!result) {
          alert("Token Expired!");
          router.replace("/signout");
        } else {
          localStorage.setItem("token", token);
        }
      });
    }
  }, [token]);

  return (
    <header className="flex items-center h-[75px] px-12 justify-start dark:bg-slate-900 bg-slate-50 border-b-2 border-slate-300">
      <Link href="/" className="flex dark:text-slate-200 uppercase font-bold text-slate-900 tracking-wider ml-2 text-3xl">
        dailyhype
      </Link>
      <div className="flex flex-1 justify-between items-center ms-4">
        <nav className="flex justify-start">
          <Link href="/" className={`${currentActivePage === "home" ? "text-black font-medium dark:text-white" : "text-slate-500 dark:text-slate-300"} ms-8 cursor-pointer hover:font-medium hover:text-black`}>
            <span>Home</span>
          </Link>
          <Link href="/man" className={`${currentActivePage === "man" ? "text-black font-medium dark:text-white" : "text-slate-500 dark:text-slate-300"} ms-8 cursor-pointer hover:font-medium hover:text-black`}>
            Man
          </Link>
          <Link href="/woman" className={`${currentActivePage === "woman" ? "text-black font-medium dark:text-white" : "text-slate-500 dark:text-slate-300"} ms-8 cursor-pointer hover:font-medium hover:text-black`}>
            Woman
          </Link>
          <Link href="/kid" className={`${currentActivePage === "kid" ? "text-black font-medium dark:text-white" : "text-slate-500 dark:text-slate-300"} ms-8 cursor-pointer hover:font-medium hover:text-black`}>
            Kid
          </Link>
          <Link href="/baby" className={`${currentActivePage === "baby" ? "text-black font-medium dark:text-white" : "text-slate-500 dark:text-slate-300"} ms-8 cursor-pointer hover:font-medium hover:text-black`}>
            Baby
          </Link>
        </nav>
        <nav className="flex flex-1 justify-end items-center">
          <Input type="text" placeholder="Search Product" className="max-w-[300px] me-6" size="sm" variant="bordered" radius="sm" startContent={theme === "dark" ? <Image width={20} src="/icons/search-dark.svg" className="flex items-center justify-center" alt="Search Icon" /> : <Image width={20} src="/icons/search.svg" className="flex items-center justify-center" alt="Search Icon" />} />
          <Badge content={cart ? cart.length : 0} className="bg-custom-color2 text-white" size="md">
            <Link href="/cart" className="px-2 py-1 hover:dark:bg-slate-700 hover:bg-slate-200 rounded-md cursor-pointer" title="Shopping Bag">
              {theme === "dark" ? <Image src="/icons/shopping-bag-dark.svg" radius="none" width={25} alt="Shopping Cart Icon" /> : <Image src="/icons/shopping-bag.svg" radius="none" width={25} alt="Shopping Cart Icon" />}
            </Link>
          </Badge>
          {theme === "light" ? (
            <Image
              title="Change to Dark Mode"
              onClick={() => {
                setTheme("dark");
              }}
              className="cursor-pointer ms-8"
              src="/icons/moon.svg"
              alt="Moon Icon"
            />
          ) : (
            <Image
              title="Change to Light Mode"
              onClick={() => {
                setTheme("light");
              }}
              className="cursor-pointer ms-8"
              src="/icons/sun.svg"
              alt="Sun Icon"
            />
          )}
          {token && (
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar as="button" className="transition-transform ms-8 border-2 border-gray-400" src={userInfo.image ? userInfo.image : theme === "light" ? "/icons/user.svg" : "/icons/user-dark.svg"} />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem href="/personal" key="info" className="h-14 gap-2">
                  <p className="font-medium">Signed in as</p>
                  <p className="font-medium">{userInfo.email}</p>
                </DropdownItem>
                <DropdownItem href="/profile" key="profile">
                  Profile
                </DropdownItem>
                <DropdownItem href="/order" key="order">
                  Order
                </DropdownItem>
                <DropdownItem href="/delivery" key="delivery">
                  Delivery
                </DropdownItem>
                <DropdownItem
                  onClick={() => {
                    router.replace("/signout");
                  }}
                  key="logout"
                  color="danger"
                >
                  Sign Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}
          {!token && (
            <>
              <Button
                onClick={() => {
                  router.push("/signin");
                }}
                variant="ghost"
                className="ms-6"
              >
                Sign In
              </Button>
              <Button
                onClick={() => {
                  router.push("/signup");
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
