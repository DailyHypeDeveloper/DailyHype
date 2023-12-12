"use client";

import React, { useState, useEffect } from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarMenuItem, NavbarItem, NavbarMenu, Link, Button, NavbarMenuToggle } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useAppState } from "../app-provider";

// validating token
// require => token
// token => string, provide token from local storage
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
// require => currentPage
// currentPage => string, provide the current page in small letters
export default function Header() {
  const { token, setToken, currentPage, setCurrentPage, isLoading, setIsLoading } = useAppState();
  const router = useRouter();

  // center items will show in center
  const centerItems = [
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

  // right items will show in right side of nav bar
  const rightItems = [
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
