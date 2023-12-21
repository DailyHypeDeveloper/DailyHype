"use client";

import { useState, useContext, createContext, useEffect } from "react";
import { CurrentActivePage } from "./_enums/global-enums";

export const AppState = createContext<any>(null);

interface UserBasicInfoInterface {
  name: string;
  email: string;
  image: string;
}

// this is the context provider component
export default function AppProvider({ children }: { children: React.ReactNode }) {
  // this will store user basic info such as name, email, image url
  const [userInfo, setUserInfo] = useState<UserBasicInfoInterface>({ name: "", email: "a@gmail.com", image: "" });

  // for storing token, only string data type is allowed
  const [token, setToken] = useState<string | null>(null);

  // for showing current active page ui
  // refer to the global-enums.ts
  const [currentActivePage, setCurrentActivePage] = useState<CurrentActivePage>(CurrentActivePage.Home);

  // for loading header based on token (verfiy token)
  // don't change this loading state unless necessary
  // this loading state will be set to false when the token is retrieved from the browser
  // this is used for ux, the user will not see the header changes
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // for storing cart data
  // cart will store array of objects got from local storage
  const [cart, setCart] = useState<object[]>([]);

  // retrieveing token from local storage
  // set loading state to false
  useEffect(() => {
    setToken(localStorage.getItem("token"));
    setCart(JSON.parse(localStorage.getItem("cart") ?? "[]"));
    setIsLoading(false);
  }, []);

  return <AppState.Provider value={{ token, setToken, userInfo, setUserInfo, currentActivePage, setCurrentActivePage, cart, setCart, isLoading, setIsLoading }}>{children}</AppState.Provider>;
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
