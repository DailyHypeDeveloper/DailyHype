"use client";
import React, { useState } from "react";
import { Input } from "@nextui-org/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ErrorMessage, URL } from "@/enums/global-enums";
import { useAppState } from "@/app/app-provider";

export default function SignIn() {
  const { setUserInfo, setHeaderCanLoad } = useAppState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const isValidEmail = (email: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      alert("Invalid email address");
      return;
    }

    fetch(`${process.env.BACKEND_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    })
      .then((response) => {
        if (response.status === 403) {
          throw new Error(ErrorMessage.Unauthorized);
        }
        return response.json();
      })
      .then((result) => {
        const token = result.token;
        const user = result.user;
        localStorage.setItem("user", JSON.stringify({ name: user.name, email: user.email, image: user.url, role: user.role }));
        setHeaderCanLoad(false);
        setUserInfo({ name: user.name, email: user.email, image: user.url, role: user.role });
        if (user.role === "admin") {
          router.push(URL.Dashboard);
        } else {
          router.push(URL.Home);
        }
      })
      .catch((error) => {
        console.error("Login failed:", error.message);
      });
  };

  return (
    <div className="w-full min-h-screen grid grid-cols-1 sm:grid-cols-2">
      <div className="left w-full sm:min-h-full flex justify-center items-center flex-col p-8">
        <a href={URL.Home} className="logo-box">
          <Image src="/images/logo.png" alt="Logo" width={300} height={150} />
        </a>
        <p className="text-center mt-4">Stay Tuned, stay Hyped!</p>
      </div>

      <div className="right w-full min-h-screen flex flex-col justify-center items-center gap-10 bg-[#FB6050] text-white">
        <h2 className="text-3xl text-center">Log in</h2>
        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-12">
            <Input type="email" label="Email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full sm:w-[85%] h-10 border-none rounded-md text-base px-4 sm:px-24 block mx-auto " />
          </div>
          <div className="mb-16">
            <Input type="password" label="Password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full sm:w-[85%] h-10 border-none rounded-md text-base px-4 sm:px-24 block mx-auto" />
          </div>

          <div className="w-full flex flex-col items-center sm:flex-row sm:justify-center">
            <button type="submit" className="bg-white text-black px-6 py-3 uppercase rounded-md hover:bg-gray-200 mb-2 sm:mb-0 sm:mr-4 md:mr-8 lg:mr-12 xl:mr-16 2xl:mr-52" id="loginButton">
              Log In
            </button>
            <a href="./signup" className="mt-2 sm:mt-0 hover:text-gray-200">
              Create your account ➡
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
