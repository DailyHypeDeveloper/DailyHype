"use client";

import React, { useState, useEffect } from "react";
import { Navbar, NavbarBrand, NavbarContent, Image, NavbarMenuItem, NavbarItem, NavbarMenu, Link, Button, NavbarMenuToggle, Input, Avatar, Badge, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useAppState } from "../app-provider";

// validating token
// require => token
// token => string, provide token from your token state (got from useAppState())
// return => promise<boolean> (true if token is valid, false for invalid token)
function validateToken(token: string): Promise<boolean> {
  if (token) {
    return fetch(`${process.env.BACKEND_URL}/api/validateToken`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log(response);
        if (response.status === 403) {
          return false;
        } else {
          return true;
        }
      })
      .catch((error) => {
        console.error(error);
        return false;
      });
  } else {
    return new Promise((resolve) => {
      resolve(true);
    });
  }
}

// header component for user
export default function Header() {
  const { token, currentPage, setCurrentPage } = useAppState();
  const router = useRouter();

  // when the token is changed, this useEffect will run
  // this will validate the token
  // useEffect(() => {
  //   if (token) {
  //     validateToken(token).then((result) => {
  //       if (!result) {
  //         alert("Token Expired!");
  //         setCurrentPage("signout");
  //         router.replace("/");
  //       }
  //     });
  //   }
  // }, [token]);

  return (
    <header className="flex items-center h-[75px] px-12 justify-start bg-slate-50 border-b-2 border-slate-300">
      <Link href="/" className="flex uppercase font-bold text-slate-700 tracking-wider ml-2 text-2xl">
        dailyhype
      </Link>
      <div className="flex flex-1 justify-between items-center ms-4">
        <nav className="flex justify-start">
          <Link href="/" className={`${currentPage === "home" ? "text-black font-medium" : "text-slate-500"} ms-8 cursor-pointer hover:font-medium hover:text-black`}>
            <span>Home</span>
          </Link>
          <Link href="/product" className={`${currentPage === "product" ? "text-black font-medium" : "text-slate-500"} ms-8 cursor-pointer hover:font-medium hover:text-black`}>
            <span>Product</span>
          </Link>
          {token && (
            <>
              <Link href="/order" className={`${currentPage === "order" ? "text-black font-medium" : "text-slate-500"} ms-8 cursor-pointer hover:font-medium hover:text-black`}>
                Order
              </Link>
              <Link href="/delivery" className={`${currentPage === "delivery" ? "text-black font-medium" : "text-slate-500"} ms-8 cursor-pointer hover:font-medium hover:text-black`}>
                Delivery
              </Link>
            </>
          )}
        </nav>
        <nav className="flex flex-1 justify-end items-center">
          <Input type="text" placeholder="Search Product" className="max-w-[350px] me-6" size="sm" variant="bordered" radius="sm" startContent={<Image width={25} src="/icons/search-icon.png" className="flex items-center justify-center" alt="Search Icon" />} />
          <Badge content="1" color="primary" size="md">
            <Link href="/cart" className="px-2 py-1 hover:bg-slate-200 rounded-md cursor-pointer">
              <Image src="/icons/shopping-cart.png" width={30} alt="Shopping Cart Icon" />
            </Link>
          </Badge>
          {token && (
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar isBordered as="button" className="transition-transform ms-6" src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="info" className="h-14 gap-2">
                  <p className="font-semibold">Signed in as</p>
                  <p className="font-semibold">zoey@example.com</p>
                </DropdownItem>
                <DropdownItem href="/profile" key="profile">
                  Profile
                </DropdownItem>
                <DropdownItem
                  onClick={() => {
                    setCurrentPage("signout");
                    router.replace("/");
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
