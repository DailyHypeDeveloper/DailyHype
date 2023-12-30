"use client";

import LoadingIcon from "@/app/_icons/loading-icon";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    fetch(`${process.env.BACKEND_URL}/api/signout`, {
      method: "POST",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((result) => {
        if (result) {
          if (localStorage) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
          }
          router.replace("/");
        }
      });
  }, []);

  return (
    <div className="flex w-screen h-screen justify-center items-center">
      <LoadingIcon className="mr-4" />
      <label className="text-2xl uppercase tracking-wide">Signing Out</label>
    </div>
  );
}
