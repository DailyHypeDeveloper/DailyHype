"use client";

import React, { useState, useEffect } from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarMenuItem, NavbarItem, NavbarMenu, Link, Button, NavbarMenuToggle } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useAppState } from "../app-provider";

// typescript for center item navigation
interface CenterItemInterface {
  name: string;
  path: string;
  page: string;
  state?: "loggedin";
}

// typescript for right item navigation
interface RightItemInterface {
  name: string;
  path: string;
  state: "loggedout" | "loggedin";
}

// validating token
// require => token
// token => string, provide token from your token state (got from useAppState())
// return => promise<boolean> (true if token is valid, false for invalid token)
function validateToken(token: string): Promise<boolean> {
  if (token) {
    return fetch(`${process.env.BACKEND_URL}/api/validateToken`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      }
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

  // center items will show in center navigation
  // array of objects, contain name, path, page and state
  // name => to display navigation text
  // path => to go to this path when this link is clicked
  // page => to set current active page ui
  // state => to show only if the user is logged in (only one value 'loggedin' is accepted)
  const centerItems: CenterItemInterface[] = [
    {
      name: "home",
      path: "/",
      page: "home"
    },
    {
      name: "product",
      path: "/product",
      page: "product"
    },
    {
      name: "profile",
      path: "/profile",
      page: "profile",
      state: "loggedin"
    },
    {
      name: "cart",
      path: "/cart",
      page: "cart",
      state: "loggedin"
    },
    {
      name: "order",
      path: "/order",
      page: "order",
      state: "loggedin"
    },
    {
      name: "delivery",
      path: "/delivery",
      page: "delivery",
      state: "loggedin"
    }
  ];

  // right items will show in right side of navigation bar
  // array of objects, contain name, path and state
  // name => to display button text
  // path => to navigate to this path if the button is clicked
  // state => to determine when to show this button (only two values "loggedout" or "loggedin" are accepted)
  const rightItems: RightItemInterface[] = [
    {
      name: "sign in",
      path: "/signin",
      state: "loggedout"
    },
    {
      name: "sign up",
      path: "/signup",
      state: "loggedout"
    },
    {
      name: "sign out",
      path: "#",
      state: "loggedin"
    }
  ];

  // when the token is changed, this useEffect will run
  // this will validate the token
  useEffect(() => {
    if (token) {
      validateToken(token).then((result) => {
        if (!result) {
          alert("Token Expired!");
          setCurrentPage("signout");
          router.replace("/");
        }
      });
    }
  }, [token]);

  return (
    <Navbar
      maxWidth="xl"
      isBordered={true}
    >
      <NavbarContent>
        <NavbarBrand>
          <p className="font-bold text-2xl uppercase select-none">dailyhype</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex gap-4"
        justify="center"
      >
        {centerItems.map((item, index) => {
          let toShow = false;

          if (item.state && item.state === "loggedin") {
            if (token !== "") toShow = true;
          } else toShow = true;

          if (toShow)
            return (
              <NavbarItem key={`${item}-${index}`}>
                <Link
                  style={{ textTransform: "capitalize" }}
                  size="md"
                  className="px-2"
                  color={item.page === currentPage ? "primary" : "foreground"}
                  href={item.path}
                >
                  {item.name}
                </Link>
              </NavbarItem>
            );
        })}
      </NavbarContent>
      <NavbarContent justify="end">
        {rightItems.map((item, index) => {
          let toShow = false;

          if (item.state === "loggedin") {
            if (token !== "") toShow = true;
          } else {
            if (token === "") toShow = true;
          }

          if (toShow)
            return (
              <NavbarItem key={`${item}-${index}`}>
                <Button
                  as={item.name === "sign out" ? Button : Link}
                  color="primary"
                  href={item.path}
                  variant="flat"
                  style={{ textTransform: "capitalize" }}
                  onClick={() => {
                    if (item.name === "sign out") {
                      setCurrentPage("signout");
                      router.replace("/");
                    }
                  }}
                >
                  {item.name}
                </Button>
              </NavbarItem>
            );
        })}
      </NavbarContent>
    </Navbar>
  );
}
