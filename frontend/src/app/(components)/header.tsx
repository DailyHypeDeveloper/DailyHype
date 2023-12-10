import React, { useState, useEffect } from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarMenuItem, NavbarItem, NavbarMenu, Link, Button, NavbarMenuToggle } from "@nextui-org/react";
import { useRouter } from "next/navigation";

interface HeaderProps {
  currentPage: string;
}

// header component for user
// require => currentPage
// currentPage => string, provide the current page in small letters
export default function Header({ currentPage }: HeaderProps) {
  const [token, setToken] = useState<string>("");
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const router = useRouter();

  // menu items is for mobile view
  const menuItems = ["Home", "Dashboard", "Activity", "Analytics", "System", "Deployments", "My Settings", "Team Settings", "Help & Feedback", "Log Out"];

  // center items will show in center
  const centerItems = [
    {
      name: "home",
      path: "/"
    },
    {
      name: "product",
      path: "/product"
    },
    {
      name: "profile",
      path: "/profile",
      state: "loggedin"
    },
    {
      name: "order",
      path: "/order",
      state: "loggedin"
    },
    {
      name: "delivery",
      path: "/delivery",
      state: "loggedin"
    }
  ];

  // right items will show in right side of nav bar
  const rightItems = [
    {
      name: "sign in",
      path: "#",
      state: "loggedout"
    },
    {
      name: "sign up",
      path: "#",
      state: "loggedout"
    },
    {
      name: "sign out",
      path: "#",
      state: "loggedin"
    }
  ];

  useEffect(() => {
    setToken(window.localStorage.getItem("token") ?? "");
  }, []);

  useEffect(() => {
    if (token === "sign out") {
      window.localStorage.removeItem("token");
      setToken("");
    }
  }, [token]);

  return (
    <Navbar
      onMenuOpenChange={setIsMenuOpen}
      maxWidth="xl"
      isBordered={true}
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
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
                  color={item.name === currentPage ? "primary" : "foreground"}
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
                  as={item.name === "sign out" ? Link : Button}
                  color="primary"
                  href={item.path}
                  variant="flat"
                  style={{ textTransform: "capitalize" }}
                  onClick={() => {
                    if (item.name === "sign out") {
                      setToken("sign out");
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
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              color={index === 2 ? "primary" : index === menuItems.length - 1 ? "danger" : "foreground"}
              className="w-full"
              href="#"
              size="lg"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
