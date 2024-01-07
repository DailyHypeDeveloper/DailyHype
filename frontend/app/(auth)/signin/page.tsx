"use client";
import React, { useEffect, useState } from "react";
import { Input,Button } from "@nextui-org/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ErrorMessage, URL } from "@/enums/global-enums";
import { useAppState } from "@/app/app-provider";
import {useGoogleLogin, TokenResponse} from "@react-oauth/google";
import axios from "axios";

export default function SignIn() {
  const { setUserInfo, setHeaderCanLoad } = useAppState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [user, setUser] = useState<TokenResponse[]>([]);

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
        localStorage.setItem("user", JSON.stringify({ id: user.userid, name: user.name, email: user.email, image: user.url, role: user.role }));
        setHeaderCanLoad(false);
        setUserInfo({ id: user.userid, name: user.name, email: user.email, image: user.url, role: user.role });
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

  const login = useGoogleLogin({
    onSuccess: (codeResponse: TokenResponse) => setUser([codeResponse]),
    onError: (error) => console.log("Login Failed:", error),
  });

  useEffect(() => {
    let token = localStorage.getItem("token");
    if (token) {
      router.push(URL.Dashboard);
    }
  }, []);

  useEffect(() => {
    if (user.length > 0) {
      const currentUser = user[0];

      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${currentUser.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${currentUser.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          console.log("This is profile");
          console.log(res.data);

          const res_id = res.data.id;
          const res_name = res.data.name;
          const res_email = res.data.email;
          const res_verified_email = res.data.verified_email;
          const res_picture = res.data.picture;

          fetch(`${process.env.BACKEND_URL}/api/signupGoogle`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({res_id, res_name, res_email, res_verified_email, res_picture}),
            credentials: "include",
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
              }
              return response.json();
            })
            .then((data) => {
              console.log("hello");
              console.log(data);
              const user = data.user;
              localStorage.setItem(
                "user",
                JSON.stringify({
                  name: user.name,
                  email: user.email,
                  image: user.url,
                  role: user.role,
                  picture : user.picture
                })
              );
              setHeaderCanLoad(false);
              setUserInfo({name: user.name, email: user.email, image: user.url, role: user.role});
              router.push(URL.Home);
            })
            .catch((error) => {
              console.error("Error posting user data:", error);
              alert("Sign In failed!");
            });
        })
        .catch((err) => {
          console.error("Error fetching user info:", err);
          alert("Sign In failed!");
        });
    }
  }, [user, router]);


  return (
    <div className="w-full min-h-screen grid grid-cols-1 sm:grid-cols-2">
      <div className="left w-full sm:min-h-full flex justify-center items-center flex-col p-8">
        <a href={URL.Home} className="logo-box">
          <Image src="/images/logo.png" alt="Logo" className="w-auto h-auto" priority={true} width={300} height={150} />
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
        <div className="grid ">
            <button
              onClick={() => login()}
              className="group  h-12 px-9 border-2 border-gray-300 rounded-full transition duration-300 hover:border-blue-400 focus:bg-blue-50 active:bg-blue-100 bg-white"
            >
              <div className="relative flex items-center space-x-6 justify-center">
                <img
                  src="https://tailus.io/sources/blocks/social/preview/images/google.svg"
                  className="w-5"
                  alt="google logo"
                />
                <span className="block w-max font-semibold tracking-wide text-gray-700 text-sm transition duration-300 group-hover:text-blue-600 sm:text-base">
                  Continue with Google
                </span>
              </div>
            </button>
          </div>

      </div>
    </div>
  );
}
