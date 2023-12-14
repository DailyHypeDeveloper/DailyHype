"use client";

import { useState, useContext, createContext, useEffect } from "react";

export const AppState = createContext<any>(null);

// setting possible pages for active page ui
type Page = "home" | "product" | "order" | "delivery" | "signout";

// this is the context provider component
// this will contain
export default function AppProvider({ children }: { children: React.ReactNode }) {
  // for storing token, only string data type is allowed
  const [token, setToken] = useState<string>("");

  // for showing current active page ui
  // refer to the above type page for available
  const [currentPage, setCurrentPage] = useState<Page>("home");

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
    // if token is undefined, it will be empty string
    setToken(localStorage.getItem("token") ?? "");
    setCart(JSON.parse(localStorage.getItem("cart") ?? "[]"));
    setIsLoading(false);
  }, []);

  // used for signout
  // if currentpage is signout, this useEffect will run
  // if token state is changed, the new token will be stored in browser
  useEffect(() => {
    if (token) {
      if (currentPage === "signout") {
        localStorage.removeItem("token");
        setToken("");
        setCurrentPage("home");
      } else {
        localStorage.setItem("token", token);
      }
    }
  }, [token, currentPage]);

  return <AppState.Provider value={{ token, setToken, currentPage, setCurrentPage, cart, setCart, isLoading }}>{children}</AppState.Provider>;
}

// to retrieve state and functions from the context
// return the context
// context => {token, setToken, currentPage, setCurrentPage, isLoading}
// for each of the state, refer to the above RootLayout function
export function useAppState() {
  const context = useContext(AppState);
  if (!context) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return context;
}
