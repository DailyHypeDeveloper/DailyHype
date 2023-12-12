"use client";

import { useState, useContext, createContext, useEffect } from "react";

export const AppState = createContext<any>(null);

// setting data type for user role
type role = "public" | "customer" | "admin";

export default function AppProvider({ children }: { children: React.ReactNode }) {
  // for storing token, only string data type is allowed
  const [token, setToken] = useState<string>("");

  // for storing user role, only "public", "admin" or "customer" is allowed
  const [userRole, setUserRole] = useState<role>("public");

  const [currentPage, setCurrentPage] = useState<string>("home");

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setToken(localStorage.getItem("token") ?? "");
    setIsLoading(false);
  }, []);

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

  return <AppState.Provider value={{ token, setToken, userRole, setUserRole, currentPage, setCurrentPage, isLoading, setIsLoading }}>{children}</AppState.Provider>;
}

// using the context state
// return the context
// context => {token, setToken, userRole, setUserRole, currentPage, setCurrentPage}
// for each of the state, refer to the above RootLayout function
export function useAppState() {
  const context = useContext(AppState);
  if (!context) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return context;
}
