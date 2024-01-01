"use client";

import { useState, useContext, createContext, useEffect } from "react";
import { CurrentActivePage, URL } from "@/enums/global-enums";
import { validateToken } from "@/functions/auth-functions";
// import Router from "next/router";

export const AppState = createContext<any>(null);

type UserRole = "" | "customer" | "admin";

interface UserBasicInfoInterface {
  name: string;
  email: string;
  image: string;
  role: UserRole;
}

// this is the context provider component
export default function AppProvider({ children }: { children: React.ReactNode }) {
  // this will store user basic info such as name, email, image url
  const [userInfo, setUserInfo] = useState<UserBasicInfoInterface>({ name: "", email: "", image: "", role: "" });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // for showing current active page ui
  // refer to the global-enums.ts
  const [currentActivePage, setCurrentActivePage] = useState<CurrentActivePage>(CurrentActivePage.None);

  // for loading header based on token (verfiy token)
  // don't change this loading state unless necessary
  // this loading state will be set to false when the token is retrieved from the browser
  // this is used for ux, the user will not see the header changes
  const [headerCanLoad, setHeaderCanLoad] = useState<boolean>(false);

  // for storing cart data
  // cart will store array of objects got from local storage
  const [cart, setCart] = useState<object[]>([]);

  // retrieveing token from local storage
  // set loading state to false
  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("cart") ?? "[]"));
    const user = localStorage.getItem("user");
    if (user) {
      const userObj = JSON.parse(user) as UserBasicInfoInterface;
      setUserInfo(userObj);
      try {
        if (userObj.role === "customer" || userObj.role === "admin")
          validateToken(userObj.role).then((result) => {
            if (result) {
              setIsAuthenticated(true);
            } else {
              setIsAuthenticated(false);
              // Router.push(URL.SignOut);
            }
          });
        else {
          setIsAuthenticated(false);
          // Router.push(URL.SignOut);
        }
      } catch (error) {
        console.error(error);
        setIsAuthenticated(false);
        // Router.push(URL.SignOut);
      } finally {
        setHeaderCanLoad(true);
      }
    } else {
      setHeaderCanLoad(true);
    }
  }, []);

  useEffect(() => {
    if (userInfo.email && userInfo.image && userInfo.name && userInfo.role) {
      try {
        validateToken(userInfo.role).then((result) => {
          if (result) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
            // Router.push(URL.SignOut);
          }
        });
      } catch (error) {
        console.error(error);
        setIsAuthenticated(false);
        // Router.push(URL.SignOut);
      } finally {
        setHeaderCanLoad(true);
      }
    }
  }, [userInfo]);

  return <AppState.Provider value={{ userInfo, setUserInfo, currentActivePage, setCurrentActivePage, cart, setCart, headerCanLoad, setHeaderCanLoad, isAuthenticated, setIsAuthenticated }}>{children}</AppState.Provider>;
}

/**
 *
 * This will return states and setState stored in context
 * @returns context (token, setToken, userInfo, setUserInfo, currentActivePage, setCurrentActivePage, cart, setCart, isLoading, setIsLoading)
 */
export function useAppState() {
  const context = useContext(AppState);
  if (!context) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return context;
}
