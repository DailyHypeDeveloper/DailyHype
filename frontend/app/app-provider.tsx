// Name: Zay Yar Tun
// Admin No: 2235035
// Class: DIT/FT/2B/02

"use client";

import { useState, useContext, createContext, useEffect } from "react";
import { CurrentActivePage, URL } from "@/enums/global-enums";
import { validateToken } from "@/functions/auth-functions";
import { CartDataLocalStorage } from "@/enums/global-interfaces";
import { removeDuplicateCartData } from "@/functions/cart-functions";

export const AppState = createContext<any>(null);

type UserRole = "" | "customer" | "admin";

interface UserBasicInfo {
  id: number;
  name: string;
  email: string;
  image: string;
  role: UserRole;
}

// this is the context provider component
export default function AppProvider({ children }: { children: React.ReactNode }) {
  // this will store user basic info such as name, email, image url
  const [userInfo, setUserInfo] = useState<UserBasicInfo>({ id: 0, name: "", email: "", image: "", role: "" });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [redirectPage, setRedirectPage] = useState<URL | null>(null);

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
  const [cart, setCart] = useState<CartDataLocalStorage[]>([]);

  // retrieveing token from local storage
  // set headerCanLoad to true
  useEffect(() => {
    try {
      const tempCart = JSON.parse(localStorage.getItem("cart") ?? "[]") as CartDataLocalStorage[];
      const isValid = tempCart.every((item: any) => {
        return item.productdetailid && item.qty && !isNaN(item.productdetailid) && !isNaN(item.qty);
      });
      if (!isValid) {
        localStorage.removeItem("cart");
        setCart([]);
      } else {
        const tempCartProcessed = removeDuplicateCartData(tempCart);
        setCart(tempCartProcessed);
        localStorage.setItem("cart", JSON.stringify(tempCartProcessed));
      }
    } catch (error) {
      localStorage.removeItem("cart");
      console.error(error);
      setCart([]);
    }
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const userObj = JSON.parse(user) as UserBasicInfo;
        setUserInfo(userObj);
        if (userObj.role === "customer" || userObj.role === "admin")
          validateToken(userObj.role, userObj.id).then((result) => {
            if (result) {
              setIsAuthenticated(true);
            } else {
              setIsAuthenticated(false);
              setRedirectPage(URL.SignOut);
            }
            setHeaderCanLoad(true);
          });
        else {
          setIsAuthenticated(false);
          setRedirectPage(URL.SignOut);
          setHeaderCanLoad(true);
        }
      } catch (error) {
        console.error(error);
        setUserInfo({ id: 0, name: "", email: "", image: "", role: "" });
        setRedirectPage(URL.SignOut);
        setIsAuthenticated(false);
        setHeaderCanLoad(true);
      }
    } else {
      setHeaderCanLoad(true);
    }
  }, []);

  useEffect(() => {
    if (userInfo.email && userInfo.name && userInfo.role) {
      validateToken(userInfo.role, userInfo.id).then((result) => {
        if (result) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          setRedirectPage(URL.SignOut);
        }
        setHeaderCanLoad(true);
      });
    }
  }, [userInfo]);

  return <AppState.Provider value={{ userInfo, setUserInfo, currentActivePage, setCurrentActivePage, cart, setCart, headerCanLoad, setHeaderCanLoad, isAuthenticated, setIsAuthenticated, redirectPage, setRedirectPage }}>{children}</AppState.Provider>;
}

/**
 *
 * This will return states and setState functiosn stored in context
 * @returns context - {userInfo, setUserInfo, currentActivePage, setCurrentActivePage, cart, setCart, headerCanLoad, setHeaderCanLoad, isAuthenticated, setIsAuthenticated, redirectPage, setRedirectPage}
 * @example
 * const {isAuthenticated, headerCanLoad} = useAppState();
 * if(isAuthenticated && headerCanLoad) {
 *    // call some api
 * }
 */
export function useAppState() {
  const context = useContext(AppState);
  if (!context) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return context;
}
